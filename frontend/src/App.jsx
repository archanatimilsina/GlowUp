
import ProductPage from './components/ProductPage';
import SkinDataForm from './components/SkinDataForm'
import Login from './components/Login'
import Register from './components/Register'
import MainLayout from "./components/MainLayout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SearchResults from './components/elementComponent/SearchResults';
import FeedbackPage from './components/FeebackPage';
import Dashboard from './components/ProfilePage';
import FaceScanningPage from './components/FaceScanningPage';
import Homepage from './components/Homepage';
import BuyPage from './components/BuyPage';
import CartPage from './components/CartPage.jsx';
import ProductDetailPage from './components/elementComponent/productDetailPage';
import BrandContact from './components/BrandContact';
import Paymentpage from './components/PaymentPage.jsx';
import DiscussionForum from './components/DiscussionForum/DiscussionForum.jsx';
import CreatePost from './components/DiscussionForum/CreateForum.jsx';
import AboutUs from './components/AboutUs.jsx';
const App = () => {
  return <>
<BrowserRouter>
<Routes>
  <Route path="/login" element={<Login/>} />
  <Route path="/register" element={<Register/>} />
<Route path="/" element={<MainLayout />}>
 <Route path="/product" element={<ProductPage />}/>
 <Route path="/profile" element={<Dashboard />} />
<Route path="/faceScanPage" element={<FaceScanningPage />} />
<Route path="/feedback" element={<FeedbackPage />} />
<Route path="/datafillUp" element={<SkinDataForm />} />
<Route path="/Searchproducts" element={<SearchResults />} />
<Route path="/cartPage" element={<CartPage />} />
<Route path="/buyPage" element={<BuyPage />} />
<Route path="/disscussionForum" element={<DiscussionForum />} />
<Route index element={<Homepage />} />
<Route path="/productDetailPage/:id" element={<ProductDetailPage />} />
<Route path="/brandContact" element={<BrandContact />} />
<Route path="/paymentpage" element={<Paymentpage />} />
<Route path="/createForum" element={<CreatePost />} />
<Route path="/AboutUs" element={<AboutUs />} />
</Route>

<Route path="/forum/disscussionForum" element={<DiscussionForum />} />
</Routes>



</BrowserRouter>
  </>
}

export default App