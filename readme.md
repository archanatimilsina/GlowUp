#  GlowUp
###  Skincare Product Recommendation System

GlowUp is a sophisticated skincare companion designed to bridge the gap between complex dermatological needs and accessible product solutions. By leveraging **Machine Learning** and a seamless **React-Django** architecture, GlowUp analyzes skin intelligence—mapping melanin, undertone, and texture—to curate a personalized regimen from our integrated e-commerce catalog.

---



## How the AI Works

### 1. Skin Tone Detection
The system follows a rigorous pipeline to ensure accuracy regardless of lighting conditions.

* **Face Landmarking:** Uses a pre-trained **MediaPipe** model to identify facial coordinates, cropping out hair and background.
* **Histogram-Based Thresholding:** Employs **Otsu’s Binarization** to calculate a "Sweet Spot" brightness threshold, isolating skin from shadows.
* **Color Space Conversion:** Converts BGR images to **YCrCb** and **HSV**. YCrCb is used specifically to separate brightness ($Y$) from color ($Cr/Cb$), ensuring robustness against lighting shifts.
* **K-Means Clustering:** Pixels are treated as data points in a 4D space ($Y, H, Cr, Cb$). K-Means groups these into clusters, selecting the dominant center to represent the skin tone.
* **Classification:** Final values are processed by a **RandomForestClassifier** to map the data to 6 categories: *Very Fair, Fair, Medium, Olive, Brown, or Dark.*

### 2. Recommendation System
Once the user profile is established, the system suggests products using Vector Mathematics.

* **One-Hot Encoding:** User skin concerns and product attributes are converted into binary vectors.
* **Cosine Similarity:** The system calculates the mathematical "angle" between the User Vector ($\mathbf{A}$) and the Product Vector ($\mathbf{B}$):


---


## 🛠️ Tools & Technologies
* **Frontend:** HTML, CSS, JavaScript, React.js
* **Backend:** Django, Django REST Framework
* **AI/ML:** Scikit-Learn, MediaPipe, OpenCV
* **Database:** SQLite

---

## 🔧 Installation & Setup

> **Note:** It is highly recommended to create a Virtual Environment before installing backend dependencies.

### 💻 Frontend Setup
```
cd frontend
npm install
npm run dev
```

### 💻 Backend Setup

```
cd backend
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate # On Windows use: venv\Scripts\activate

# Install requirements and run
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
---

## 🖼️ Project Gallery

###  Core Experience
**Landing Page** ![Home Page](assets/LandingPage.png)

**AI Skin Tone Analysis** ![AI Facial Scan](assets/Skin%20Tone%20Analysis%20Page.png)

**User Skin Detail Form** ![User skin detail form](assets/User%20Skin%20detail%20Form.png)

**User Profile Dashboard** ![Profile Page](assets/Profile%20Page.png)

**Product Catalog** ![Product page](assets/Product%20Page.png)

**Product Details** ![Product Detail page](assets/product%20detail%20page.png)

**Discussion Forum** ![Discussion Forum](assets/discussion%20Forum.png)

**Shopping Cart** ![Cart Page](assets/CArt%20Page.png)

**Contact & Support** ![Contact Page](assets/contact%20Page.png)

**User Feedback** ![Feedback Page](assets/Feedback%20Page.png)

**Create Community Post** ![Create Post](assets/Create%20post%20Page.png)
