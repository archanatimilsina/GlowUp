import cv2
import numpy as np
import mediapipe as mp
import os
import pandas as pd
from sklearn.cluster import KMeans
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

# --- 1. SETUP AI BRAIN (MediaPipe) ---
current_dir = os.path.dirname(os.path.abspath(__file__))
# Ensure this file is in the same folder as this script!
model_path = os.path.join(current_dir, 'face_landmarker.task')

if not os.path.exists(model_path):
    print(f"CRITICAL ERROR: Model file NOT FOUND at {model_path}")
    detector = None
else:
    base_options = python.BaseOptions(model_asset_path=model_path)
    options = vision.FaceLandmarkerOptions(
        base_options=base_options,
        output_face_blendshapes=False,
        output_facial_transformation_matrixes=False,
        num_faces=1)
    detector = vision.FaceLandmarker.create_from_options(options)

# --- 2. CLEANING THE IMAGE (Thresholding) ---
def get_thresholded_mask(img_bgr):
    """Separates the face from shadows/background using brightness."""
    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    histogram, _ = np.histogram(gray, 256, [0, 256])
    totsu, _ = cv2.threshold(gray, 0, 255, cv2.THRESH_OTSU + cv2.THRESH_BINARY)
    tmax = np.where(histogram == max(histogram))[0][0]
    
    tfinal = round((totsu + tmax) / 2) if tmax > 10 else round((totsu + tmax) / 4)
    threshold_type = cv2.THRESH_BINARY if tmax < 220 else cv2.THRESH_BINARY_INV
    _, mask = cv2.threshold(gray, tfinal, 255, threshold_type)
    return mask

# --- 3. COLOR ANALYSIS (K-Means) ---
def skin_cluster_analysis(img_bgr, mask):
    """Finds the dominant skin color and extracts Y, H, Cr, Cb."""
    hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)
    ycrcb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2YCrCb)
    
    # This filter looks for 'skin-like' colors only
    skin_filter = (
        (hsv[:,:,0] <= 170) &
        (ycrcb[:,:,1] >= 140) & (ycrcb[:,:,1] <= 170) &
        (ycrcb[:,:,2] >= 90) & (ycrcb[:,:,2] <= 120) &
        (mask == 255)
    )
    
    y_coords, x_coords = np.where(skin_filter)
    if len(y_coords) == 0:
        return None
    
    # We build a table of 4 columns for the AI to learn from
    data = pd.DataFrame()
    data['Y'] = ycrcb[y_coords, x_coords, 0]  # Brightness
    data['H'] = hsv[y_coords, x_coords, 0]    # Color Tone
    data['Cr'] = ycrcb[y_coords, x_coords, 1] # Red-ness
    data['Cb'] = ycrcb[y_coords, x_coords, 2] # Blue-ness
    
    # Group the pixels into 3 'piles' and pick the biggest one
    kmeans = KMeans(n_clusters=3, n_init=5, max_iter=100, random_state=42)
    kmeans.fit(data)
    
    labels, counts = np.unique(kmeans.labels_, return_counts=True)
    dominant_idx = labels[np.argmax(counts)]
    return kmeans.cluster_centers_[dominant_idx]

def skin_detection(img_path):
    if detector is None:
        return np.array([0, 0, 0, 0])

    img = cv2.imread(img_path)
    if img is None:
        print("Error: Could not read image.")
        return np.array([0, 0, 0, 0])
    
    h_orig, w_orig = img.shape[:2]
    scale = min(400/w_orig, 500/h_orig)
    img = cv2.resize(img, (int(w_orig*scale), int(h_orig*scale)))
    h_new, w_new = img.shape[:2]

    # Use MediaPipe to find landmarks
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=img_rgb)
    detection_result = detector.detect(mp_image)

    if not detection_result.face_landmarks:
        print("AI could not find a face.")
        return np.array([0, 0, 0, 0])

    # Crop the image to just the face area
    landmarks = detection_result.face_landmarks[0]
    x_points = [int(pt.x * w_new) for pt in landmarks]
    y_points = [int(pt.y * h_new) for pt in landmarks]
    x1, y1, x2, y2 = max(0, min(x_points)), max(0, min(y_points)), min(w_new, max(x_points)), min(h_new, max(y_points))
    face_crop = img[y1:y2, x1:x2]

    mask = get_thresholded_mask(face_crop)
    result = skin_cluster_analysis(face_crop, mask)

    if result is not None:
        return result 
    return np.array([0, 0, 0, 0])





# import cv2
# import numpy as np
# import mediapipe as mp
# import os
# import pandas as pd
# from sklearn.cluster import KMeans
# from mediapipe.tasks import python
# from mediapipe.tasks.python import vision

# # --- 1. SETUP AI BRAIN ---
# current_dir = os.path.dirname(os.path.abspath(__file__))
# model_path = os.path.join(current_dir, 'face_landmarker.task')

# if not os.path.exists(model_path):
#     print(f"CRITICAL ERROR: Model file NOT FOUND at {model_path}")
#     detector = None
# else:
#     base_options = python.BaseOptions(model_asset_path=model_path)
#     options = vision.FaceLandmarkerOptions(
#         base_options=base_options,
#         output_face_blendshapes=False,
#         output_facial_transformation_matrixes=False,
#         num_faces=1)
#     detector = vision.FaceLandmarker.create_from_options(options)

# # --- 2. HISTOGRAM & THRESHOLDING FUNCTIONS ---
# def get_thresholded_mask(img_bgr):
#     """Finds the most common brightness and creates a binary mask."""
#     gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    
#     # Create Histogram
#     histogram, _ = np.histogram(gray, 256, [0, 256])
    
#     # Find Otsu Threshold (Automatic separation)
#     totsu, _ = cv2.threshold(gray, 0, 255, cv2.THRESH_OTSU + cv2.THRESH_BINARY)
    
#     # Find Tmax (The most repeated brightness value)
#     tmax = np.where(histogram == max(histogram))[0][0]
    
#     # Combine them for a final 'Sweet Spot' threshold
#     tfinal = round((totsu + tmax) / 2) if tmax > 10 else round((totsu + tmax) / 4)
    
#     # Create the binary mask (Black and White image)
#     threshold_type = cv2.THRESH_BINARY if tmax < 220 else cv2.THRESH_BINARY_INV
#     _, mask = cv2.threshold(gray, tfinal, 255, threshold_type)
    
#     return mask

# # --- 3. CLUSTERING FUNCTIONS ---
# def skin_cluster_analysis(img_bgr, mask):
#     """Uses K-Means to find the most dominant skin color cluster."""
#     hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)
#     ycrcb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2YCrCb)
    
#     # Apply skin color range filter
#     skin_filter = (
#         (hsv[:,:,0] <= 170) &
#         (ycrcb[:,:,1] >= 140) & (ycrcb[:,:,1] <= 170) &
#         (ycrcb[:,:,2] >= 90) & (ycrcb[:,:,2] <= 120) &
#         (mask == 255) # Must also pass our Histogram Threshold
#     )
    
#     # Get coordinates of skin pixels
#     y_coords, x_coords = np.where(skin_filter)
    
#     if len(y_coords) == 0:
#         return None
    
#     # Build a table (DataFrame) for K-Means
#     data = pd.DataFrame()
#     data['H'] = hsv[y_coords, x_coords, 0]
#     data['Cr'] = ycrcb[y_coords, x_coords, 1]
#     data['Cb'] = ycrcb[y_coords, x_coords, 2]
    
#     # K-Means: Group pixels into 3 color piles
#     kmeans = KMeans(n_clusters=3, n_init=5, max_iter=100, random_state=42)
#     kmeans.fit(data)
    
#     # Pick the cluster that represents the most common skin tone
#     # We use the cluster centers (averages)
#     centers = kmeans.cluster_centers_
    
#     # In this logic, we return the cluster center that has the most pixels
#     labels, counts = np.unique(kmeans.labels_, return_counts=True)
#     dominant_idx = labels[np.argmax(counts)]
    
#     return centers[dominant_idx] # Returns [H, Cr, Cb]

# # --- 4. MAIN SKIN DETECTION FUNCTION ---
# def skin_detection(img_path):
#     if detector is None:
#         return np.array([0, 0, 0])

#     # Load and Resize
#     img = cv2.imread(img_path)
#     if img is None:
#         return np.array([0, 0, 0])
    
#     # Resize for speed
#     h_orig, w_orig = img.shape[:2]
#     scale = min(400/w_orig, 500/h_orig)
#     img = cv2.resize(img, (int(w_orig*scale), int(h_orig*scale)))
#     h_new, w_new = img.shape[:2]

#     # AI: Find Face
#     img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
#     mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=img_rgb)
#     detection_result = detector.detect(mp_image)

#     if not detection_result.face_landmarks:
#         print("AI could not find a face.")
#         return np.array([0, 0, 0])

#     # AI: Find the bounding box of the face to ignore the background
#     landmarks = detection_result.face_landmarks[0]
#     x_points = [int(pt.x * w_new) for pt in landmarks]
#     y_points = [int(pt.y * h_new) for pt in landmarks]
    
#     x1, y1 = max(0, min(x_points)), max(0, min(y_points))
#     x2, y2 = min(w_new, max(x_points)), min(h_new, max(y_points))
    
#     # CROP to face only
#     face_crop = img[y1:y2, x1:x2]

#     # Step A: Histogram Thresholding
#     mask = get_thresholded_mask(face_crop)
    
#     # Step B: K-Means Clustering on the face
#     result = skin_cluster_analysis(face_crop, mask)

#     if result is not None:
#         # Return H, Cr, Cb
#         return np.array([result[0], result[1], result[2]])
#     else:
#         return np.array([0, 0, 0])







# Example Usage:
# color_values = skin_detection('my_photo.jpg')
# print(f"Average Skin Tone (H, Cr, Cb): {color_values}")


## mediapipe
# import cv2
# import numpy as np
# import mediapipe as mp
# import os
# from mediapipe.tasks import python
# from mediapipe.tasks.python import vision


# current_dir = os.path.dirname(os.path.abspath(__file__))
# model_path = os.path.join(current_dir, 'face_landmarker.task')

# if not os.path.exists(model_path):
#     print(f"CRITICAL ERROR: Model file NOT FOUND at {model_path}")
#     detector = None
# else:
#     base_options = python.BaseOptions(model_asset_path=model_path)
#     options = vision.FaceLandmarkerOptions(
#         base_options=base_options,
#         output_face_blendshapes=False,
#         output_facial_transformation_matrixes=False,
#         num_faces=1)
#     detector = vision.FaceLandmarker.create_from_options(options)


# def skin_detection(img_path):

    
#     if detector is None:
#         return np.array([0, 0, 0])

#     img = cv2.imread(img_path)
#     if img is None:
#         print(f"Error: Could not read image at {img_path}")
#         return np.array([0, 0, 0])
 
#     hsv_check = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
#     h_ch, s_ch, v_ch = cv2.split(hsv_check)
    
#     avg_v = np.mean(v_ch) 
    
#     if avg_v < 100:

#         s_ch = cv2.add(s_ch, 40) 
#         v_ch = cv2.add(v_ch, 40)
#         img = cv2.cvtColor(cv2.merge((h_ch, s_ch, v_ch)), cv2.COLOR_HSV2BGR)

#     lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
#     l, a, b = cv2.split(lab)
#     clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8,8))
#     l = clahe.apply(l)
#     img = cv2.cvtColor(cv2.merge((l, a, b)), cv2.COLOR_LAB2BGR)

#     h_orig, w_orig, _ = img.shape
#     img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
#     mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=img_rgb)
#     detection_result = detector.detect(mp_image)

#     if not detection_result.face_landmarks:
#         print("AI could not find a face.")
#         return np.array([0, 0, 0])

#     landmarks = detection_result.face_landmarks[0]
#     points = [landmarks[234], landmarks[454]]
    
#     final_h_vals = []
#     final_cr_vals = []
#     final_cb_vals = []
    

#     ycrcb_img = cv2.cvtColor(img, cv2.COLOR_BGR2YCrCb)
#     hsv_img = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

#     for pt in points:
#         x, y = int(pt.x * w_orig), int(pt.y * h_orig)
        
#         y1, y2 = max(0, y-5), min(h_orig, y+5)
#         x1, x2 = max(0, x-5), min(w_orig, x+5)
        
#         sample_ycrcb = ycrcb_img[y1:y2, x1:x2]
#         sample_hsv = hsv_img[y1:y2, x1:x2]
        
#         if sample_ycrcb.size > 0:
#             avg_ycc = np.mean(sample_ycrcb, axis=(0, 1))
#             avg_hsv = np.mean(sample_hsv, axis=(0, 1))
            

#             final_h_vals.append(avg_hsv[0])     
#             final_cr_vals.append(avg_ycc[1])   
#             final_cb_vals.append(avg_ycc[2])    

#     if not final_h_vals:
#         return np.array([0, 0, 0])

#     return np.array([
#         np.mean(final_h_vals), 
#         np.mean(final_cr_vals), 
#         np.mean(final_cb_vals)
#     ])
## mediapipe


# import cv2
# import numpy as np
# import pandas as pd
# import matplotlib.pyplot as plt
# from sklearn.cluster import KMeans
# def read_and_resize_image(image_path, max_width = 400, max_height = 500):
#     img = cv2.imread(image_path , cv2.IMREAD_COLOR)
#     if img is None:
#         raise FileNotFoundError(f"Could not find or open image at: {image_path}")
#     height, width = img.shape[:2]
#     # print(width, height)
#     f1 = max_width/width
#     f2 = max_height/height
#     f= min(f1,f2)
#     new_dim = int(width*f), int(height*f)
#     # print(new_dim)
#     resized_img = cv2.resize(img, new_dim, interpolation=cv2.INTER_AREA)
#     return resized_img
    

# def plot_histogram(histogram, totsu, tmax, tfinal, bin_edges):
#     plt.figure()
#     plt.title("Image Histogram")
#     plt.xlabel("Pixel Value")
#     plt.ylabel("frequency")
#     plt.xlim([0,256])
#     plt.plot(bin_edges[0:-1],histogram)
#     plt.axvline(x=tmax, color='red',linestyle="--", label="Tmax")
#     plt.axvline(x=totsu, color='green',linestyle="--", label="Totsu")
#     plt.axvline(x=tfinal, color='yellow',linestyle="--", label="Tfinal")
#     plt.legend()
#     plt.show()
# def thresholding(images):
#    histogram,bin_edges = np.histogram(images['grayscale'],256,[0, 256])
#    totsu ,_ = cv2.threshold(images['grayscale'], 200, 255, cv2.THRESH_OTSU + cv2.THRESH_BINARY_INV)
#    Tmax= np.where(histogram[:]== max(histogram[:]))[0][0]
#    Tfinal = round((totsu+Tmax)/2) if Tmax>10 else round((totsu+Tmax)/4)
#    # plot_histogram(histogram,totsu, Tmax, Tfinal, bin_edges)
#    threshold_type = (cv2.THRESH_BINARY if Tmax<220 else cv2.THRESH_BINARY_INV)
#    Tfinal, thresholded_image = cv2.threshold(images['grayscale'], Tfinal, 255, threshold_type)
#    masked_image = cv2.bitwise_and(images['BGR'],images['BGR'], mask=thresholded_image)
#    return masked_image
# def image_conversions(img_BGR):
#     images ={
#         'BGR':img_BGR,
#         'grayscale':cv2.cvtColor(img_BGR,cv2.COLOR_BGR2GRAY),
#     }
#     images['thresholded'] = thresholding(images)
#     images['HSV'] = cv2.cvtColor(img_BGR, cv2.COLOR_BGR2HSV)
#     images['ycrcb']=cv2.cvtColor(img_BGR, cv2.COLOR_BGR2YCrCb)
#     return images
# def display_image(image, name):
#     window_name=name
#     cv2.namedWindow(window_name)
#     cv2.imshow(window_name, image)
#     cv2.waitKey()
#     cv2.destroyAllWindows()
# def display_all_images(images):
#     for key, value in images.items():
#         display_image(value, key)
# def write_all_images(images):
#     for key, value in images.items():
#         cv2.imwrite(key+".jpg", value)
# # def dataframe(images):
# #      dframe = pd.DataFrame()
# #      dframe['H'] = images['HSV'].reshape([-1,3])[:,0]
# #      gray= cv2.cvtColor(images['thresholded'], cv2.COLOR_BGR2GRAY)
# #      yx_coords = np.column_stack(np.where(gray>=0))
# #      dframe['Y']=yx_coords[:,0]
# #      dframe['X']=yx_coords[:,1]
# #      dframe['Cr'] = images['ycrcb'].reshape([-1,3])[:,1]
# #      dframe['Cb'] = images['ycrcb'].reshape([-1,3])[:,2]
# #      dframe['I']= images['skin_predict'].reshape([1,images['skin_predict'].size])[0]
# #      dframe_removed = dframe[dframe['H']==0]
# #      dframe.drop(dframe[dframe['H'] == 0].index, inplace=True)
# #      return dframe, dframe_removed
# def dataframe(images):
#     # 1. Find ONLY the pixels that were predicted as skin
#     # This reduces your table from 200,000 rows to maybe 15,000!
#     skin_indices = np.where(images['skin_predict'] == 255)
    
#     if len(skin_indices[0]) == 0:
#         return pd.DataFrame(), pd.DataFrame()

#     dframe = pd.DataFrame()
#     # Pull H, Cr, Cb and coordinates ONLY for those skin pixels
#     dframe['H'] = images['HSV'][skin_indices][:, 0]
#     dframe['Y'] = skin_indices[0] # Y coordinate
#     dframe['X'] = skin_indices[1] # X coordinate
#     dframe['Cr'] = images['ycrcb'][skin_indices][:, 1]
#     dframe['Cb'] = images['ycrcb'][skin_indices][:, 2]
#     dframe['I'] = images['skin_predict'][skin_indices]
    
#     # We return an empty dataframe for 'removed' because we don't need it anymore
#     return dframe, pd.DataFrame()
# def skin_predict(images):
#     # print(f"grayscale image shape is {images['grayscale'].shape[:2]}")
#     height, width = images['grayscale'].shape[:2]
#     # images['skin_predict']= np.zeros_like(images['grayscale'])
#     # for i in range(height):
#     #    for j in range(width):
#     #     if(images['HSV'].item(i,j,0) <=170) & (140 <= images['ycrcb'].item(i,j,1) <= 170) & (90<= images['ycrcb'].item(i,j,2) <= 120):
#     #         images['skin_predict'][i,j]= 255
#     #     else:
#     #         images['skin_predict'][i,j]=0
#     mask = (
#     (images['HSV'][:,:,0] <= 170) &
#     (images['ycrcb'][:,:,1] >= 140) & (images['ycrcb'][:,:,1] <= 170) &
#     (images['ycrcb'][:,:,2] >= 90) & (images['ycrcb'][:,:,2] <= 120)
# )
#     images['skin_predict'] = np.zeros_like(images['grayscale'])
#     images['skin_predict'][mask] = 255
#     return height, width

# def skin_cluster(dframe):
#      kmeans= KMeans(
#         init="random",
#         n_init=5,
#         n_clusters=3,
#         max_iter=100,
#         random_state=42
#                 )
#      kmeans.fit(dframe)
#      km_cc = kmeans.cluster_centers_
#     #  print(f"kmcc is {km_cc}")
#     #  skin_cluster_row = km_cc[km_cc[:, -1] == max(km_cc[:, -1]), :]
#     #  print(f"skin cluster row is {skin_cluster_row}")
#     #  skin_cluster_label = np.where(
#     #     [np.allclose(row, skin_cluster_row) for row in km_cc])[0][0]
#      skin_cluster_label = np.argmax(km_cc[:, -1])
#      skin_cluster_row = km_cc[skin_cluster_label]
#     # Add cluster-label column to the dataframe
#      dframe['cluster'] = kmeans.labels_
#      return skin_cluster_row, skin_cluster_label

# # # Append removed pixels to the dataframe and get cluster matrix
# # def cluster_matrix(dframe, dframe_removed, skin_cluster_label, height, width):
# #     dframe_removed['cluster'] = np.full((len(dframe_removed.index), 1), -1)
# #     dframe = pd.concat([dframe, dframe_removed], ignore_index=False).sort_index()
# #     dframe['cluster'] = (dframe['cluster'] ==
# #                          skin_cluster_label).astype(int) * 255
# #     cluster_label_mat = np.asarray(
# #         dframe['cluster'].values.reshape(height, width), dtype=np.uint8)
# #     return cluster_label_mat

# def cluster_matrix(dframe, dframe_removed, skin_cluster_label, height, width):
#     # 1. Create a blank black image (all zeros)
#     cluster_label_mat = np.zeros((height, width), dtype=np.uint8)
    
#     # 2. Get the coordinates of pixels that belong to the "Skin Cluster"
#     skin_pixels = dframe[dframe['cluster'] == skin_cluster_label]
    
#     # 3. "Paint" those specific spots white (255)
#     y_coords = skin_pixels['Y'].values
#     x_coords = skin_pixels['X'].values
#     cluster_label_mat[y_coords, x_coords] = 255
    
#     return cluster_label_mat


# # final segmentation
# def final_segment(images, cluster_label_mat):
#     final_segment_img = cv2.bitwise_and(
#         images["BGR"], images["BGR"], mask=cluster_label_mat)
#     images["final_segment"] = final_segment_img
#     # display_image(final_segment_img, "final segmentation")


# def skin_detection(img_path):
#     # Read img using image path
#     original = read_and_resize_image(img_path)
#     # convert original image into another form
#     images = image_conversions(original)
#     #change the skin pixel to 255 if the pixel is inside the thresholding value andget the height and width of the image
#     height, width = skin_predict(images)
#     # 
#     dframe, dframe_removed = dataframe(images)
#     skin_cluster_row, skin_cluster_label = skin_cluster(dframe)
#     cluster_label_mat = cluster_matrix(
#         dframe, dframe_removed, skin_cluster_label, height, width)
#     final_segment(images, cluster_label_mat)
#     display_all_images(images)
#     # write_all_images(images)
#     # skin_cluster_row = np.delete(skin_cluster_row, 1)
#     # skin_cluster_row = np.delete(skin_cluster_row, 2)
#     # return np.delete(skin_cluster_row, -1)
#     h_val = skin_cluster_row[0]
#     cr_val = skin_cluster_row[3]
#     cb_val = skin_cluster_row[4]
    
#     # Return as a simple list [H, Cr, Cb]
#     return np.array([h_val, cr_val, cb_val])
#     # return images["final_segment"]

# # # skin_detection('./aprina.jpg')




# try 


# import cv2
# import numpy as np
# import pandas as pd
# import matplotlib.pyplot as plt
# from sklearn.cluster import KMeans

# def improve_lighting(img):
#     """
#     Normalizes lighting across the face using CLAHE.
#     This prevents shadows from being misidentified as dark skin.
#     """
#     lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
#     l, a, b = cv2.split(lab)
#     clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8,8))
#     cl = clahe.apply(l)
#     limg = cv2.merge((cl, a, b))
#     return cv2.cvtColor(limg, cv2.COLOR_LAB2BGR)

# def read_and_resize_image(image_path, max_width=400, max_height=500):
#     img = cv2.imread(image_path, cv2.IMREAD_COLOR)
#     if img is None:
#         raise FileNotFoundError(f"Could not find or open image at: {image_path}")
    
#     # Apply lighting improvement
#     img = improve_lighting(img)
    
#     height, width = img.shape[:2]
#     f1 = max_width/width
#     f2 = max_height/height
#     f = min(f1, f2)
#     new_dim = int(width*f), int(height*f)
#     resized_img = cv2.resize(img, new_dim, interpolation=cv2.INTER_AREA)
#     return resized_img

# def thresholding(images):
#     histogram, bin_edges = np.histogram(images['grayscale'], 256, [0, 256])
#     totsu, _ = cv2.threshold(images['grayscale'], 0, 255, cv2.THRESH_OTSU + cv2.THRESH_BINARY_INV)
#     Tmax = np.where(histogram[:] == max(histogram[:]))[0][0]
#     Tfinal = round((totsu + Tmax) / 2) if Tmax > 10 else round((totsu + Tmax) / 4)
    
#     threshold_type = (cv2.THRESH_BINARY if Tmax < 220 else cv2.THRESH_BINARY_INV)
#     _, thresholded_image = cv2.threshold(images['grayscale'], Tfinal, 255, threshold_type)
#     masked_image = cv2.bitwise_and(images['BGR'], images['BGR'], mask=thresholded_image)
#     return masked_image

# def image_conversions(img_BGR):
#     images = {
#         'BGR': img_BGR,
#         'grayscale': cv2.cvtColor(img_BGR, cv2.COLOR_BGR2GRAY),
#     }
#     images['thresholded'] = thresholding(images)
#     images['HSV'] = cv2.cvtColor(img_BGR, cv2.COLOR_BGR2HSV)
#     images['ycrcb'] = cv2.cvtColor(img_BGR, cv2.COLOR_BGR2YCrCb)
#     return images

# def skin_predict(images):
#     height, width = images['grayscale'].shape[:2]
    
#     # Broad adaptive mask for all skin tones (Deep, Olive, Fair)
#     # Combining YCrCb and HSV ranges
#     mask_ycrcb = cv2.inRange(images['ycrcb'], (0, 133, 77), (255, 173, 127))
#     mask_hsv = cv2.inRange(images['HSV'], (0, 15, 0), (25, 255, 255))
    
#     combined_mask = cv2.bitwise_and(mask_ycrcb, mask_hsv)
    
#     # Clean up the mask (remove hair/noise)
#     kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
#     combined_mask = cv2.morphologyEx(combined_mask, cv2.MORPH_OPEN, kernel)
    
#     images['skin_predict'] = combined_mask
#     return height, width

# def dataframe(images):
#     skin_indices = np.where(images['skin_predict'] == 255)
    
#     if len(skin_indices[0]) == 0:
#         return pd.DataFrame(), pd.DataFrame()

#     dframe = pd.DataFrame()
#     dframe['H'] = images['HSV'][skin_indices][:, 0]
#     dframe['S'] = images['HSV'][skin_indices][:, 1] # Added Saturation
#     dframe['V'] = images['HSV'][skin_indices][:, 2] # Added Brightness
#     dframe['Y'] = skin_indices[0]
#     dframe['X'] = skin_indices[1]
#     dframe['Cr'] = images['ycrcb'][skin_indices][:, 1]
#     dframe['Cb'] = images['ycrcb'][skin_indices][:, 2]
    
#     return dframe, pd.DataFrame()

# def skin_cluster(dframe):
#     # Cluster based on Color (Cr, Cb) and Brightness (V)
#     kmeans = KMeans(
#         init="random",
#         n_init=10,
#         n_clusters=3,
#         max_iter=100,
#         random_state=42
#     )
#     # We cluster on Cr, Cb, and V to separate highlights and shadows
#     kmeans.fit(dframe[['Cr', 'Cb', 'V']])
#     km_cc = kmeans.cluster_centers_
    
#     # Identify the cluster with the highest density (most pixels)
#     labels, counts = np.unique(kmeans.labels_, return_counts=True)
#     skin_cluster_label = labels[np.argmax(counts)]
    
#     # Get the mean values of the chosen skin cluster
#     skin_cluster_row = dframe[kmeans.labels_ == skin_cluster_label].mean().values
    
#     dframe['cluster'] = kmeans.labels_
#     return skin_cluster_row, skin_cluster_label

# def cluster_matrix(dframe, dframe_removed, skin_cluster_label, height, width):
#     cluster_label_mat = np.zeros((height, width), dtype=np.uint8)
#     skin_pixels = dframe[dframe['cluster'] == skin_cluster_label]
    
#     y_coords = skin_pixels['Y'].values.astype(int)
#     x_coords = skin_pixels['X'].values.astype(int)
#     cluster_label_mat[y_coords, x_coords] = 255
    
#     return cluster_label_mat

# def final_segment(images, cluster_label_mat):
#     final_segment_img = cv2.bitwise_and(images["BGR"], images["BGR"], mask=cluster_label_mat)
#     images["final_segment"] = final_segment_img

# def display_all_images(images):
#     for key, value in images.items():
#         cv2.imshow(key, value)
#     cv2.waitKey(0)
#     cv2.destroyAllWindows()

# def skin_detection(img_path):
#     # 1. Read and Resize
#     original = read_and_resize_image(img_path)
#     # 2. Convert Colorspaces
#     images = image_conversions(original)
#     # 3. Predict Skin Mask
#     height, width = skin_predict(images)
#     # 4. Prepare Data for AI
#     dframe, dframe_removed = dataframe(images)
    
#     if dframe.empty:
#         return np.array([0, 0, 0])

#     # 5. Cluster Pixels to find dominant tone
#     skin_cluster_row, skin_cluster_label = skin_cluster(dframe)
#     # 6. Create Visual Mask
#     cluster_label_mat = cluster_matrix(dframe, dframe_removed, skin_cluster_label, height, width)
#     # 7. Segment Image
#     final_segment(images, cluster_label_mat)
    
#     # Show Results
#     display_all_images(images)

#     # Return values in order: H, Cr, Cb
#     # skin_cluster_row columns: [H, S, V, Y, X, Cr, Cb]
#     h_val = skin_cluster_row[0]
#     cr_val = skin_cluster_row[5]
#     cb_val = skin_cluster_row[6]
    
#     return np.array([h_val, cr_val, cb_val])

# Example Call:
# result = skin_detection('./your_image.jpg')


# #try 