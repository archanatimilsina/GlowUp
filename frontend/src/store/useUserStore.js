import { create } from 'zustand';

const useUserStore = create((set) => ({
    email: localStorage.getItem("email"),
    profilePic: localStorage.getItem("profilePic"),
    skinTone: localStorage.getItem("skin_tone"),   
    skinType: localStorage.getItem("skin_type"),    
    skinConcerns: localStorage.getItem("skin_concerns"), 
    isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
    username: localStorage.getItem("username"),

    setUserData: (data) => {
        // 2. This part is smart: it saves whatever you pass into localStorage
        Object.keys(data).forEach((key) => {
            if (data[key] !== undefined && data[key] !== null) {
                localStorage.setItem(key, data[key]);
            }
        });
        set((state) => ({ ...state, ...data }));
    },

    fetchUserProfile: async (email) => {
        if (!email) return;
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/get-profile/?email=${email}`);
            const data = await response.json();
            
            if (response.ok) {
                // 3. Map the Database names (underscores) to Store names (camelCase)
                const freshData = {
                    skin_tone: data.skin_tone, // Saving as underscore in localStorage
                    skinTone: data.skin_tone,  // Saving as camelCase in Store state
                    skin_type: data.skin_type,
                    skinType: data.skin_type,
                    skin_concerns: data.skin_concerns,
                    skinConcerns: data.skin_concerns,
                    profilePic: data.profile_pic,
                    username: data.username
                };
                
                useUserStore.getState().setUserData(freshData);
            }
        } catch (error) {
            console.error("Failed to sync with database:", error);
        }
    },

    logout: () => {
        localStorage.clear();
        set({ 
            username: "User", 
            email: "", 
            profilePic: null, 
            isLoggedIn: false, 
            skinType: "", 
            skinTone: "", 
            skinConcerns: "" 
        });
    },
}));

export default useUserStore;