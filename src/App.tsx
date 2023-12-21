// Private Imports
import {
  Home,
  Explore,
  Saved,
  CreatePost,
  AllUsers,
} from "@/_root/pages";

// Routes Imports
import SigninForm from './_auth/forms/SigninForm'
import SignupForm from './_auth/forms/SignupForm'
import { Routes,Route } from 'react-router-dom';
import AuthLayout from './_auth/AuthLayout'
import RootLayout from './_root/RootLayout' 
import { Toaster } from "@/components/ui/toaster";
// Style Import
import './globals.css';
const App = () => {
  return (
    <main className='flex h-screen'>
        <Routes>
            {/* public routes */}
            <Route element ={<AuthLayout />}>
              <Route path="/sign-up" element={<SignupForm />} /> 
              <Route path="/sign-in" element={<SigninForm />} /> 
            </Route>

            {/* private routes */}
            <Route element = {<RootLayout />}>
              <Route index element ={<Home />} /> 
              <Route path="/explore" element={<Explore />} />
              <Route path="/saved" element={<Saved />} />
              <Route path="/all-users" element={<AllUsers />} />
              <Route path="/create-post" element={<CreatePost />} />
            </Route>
        </Routes>

      <Toaster/>
    </main>
  )
}

export default App