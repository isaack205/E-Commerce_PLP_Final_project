import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeSlashIcon, EnvelopeIcon, LockClosedIcon } from "@heroicons/react/20/solid";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/authContext";
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState('');
    const [loginError, setLoginError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth(); // Get the login function from AuthContext
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setLoginError(null);
        setEmailError(''); // Clear previous email errors
        setPasswordError(''); // Clear previous password errors

        let isValid = true;

        // --- Email Validation ---
        if(!email.trim()) {
            setEmailError('Email is required')
            isValid = false
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError('Invalid email format.');
            isValid = false;
        }

        // --- Password Validation ---
        if (!password) {
            setPasswordError('Password is required.');
            isValid = false;
        } else if (password.length < 8) {
            setPasswordError('Password must be at least 6 characters long.');
            isValid = false;
        }

        // If any validation failed, stop here
        if (!isValid) {
            setLoading(false); // Stop loading if validation failed
            return;
        }

        try {
            await login(email, password);
            navigate('/'); // Redirect to homepage
        } catch (error) {
            setLoginError(error.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    }

    return(
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <Card className="max-w-md w-full space-y-4 bg-gradient-to-t from-primary- to-blue-400">
                <CardHeader className="text-center">
                    <CardTitle className="font-bold text-3xl">Welcome Back!</CardTitle>
                    <CardDescription className="text-md font-medium">Sign in to your account</CardDescription>
                    
                </CardHeader>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {loginError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4 text-center" role="alert">
                            {loginError}
                        </div>
                    )}
                    <CardContent className="mb-5">
                        {/* Email */}
                        <div className="grid gap-2 mb-5">
                            <Label htmlFor="email" className="text-md">Email Address</Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <EnvelopeIcon className="size-5"/>
                                </div>
                                <Input
                                    type="email"
                                    id="email"
                                    name="email"
                                    autoComplete="email"
                                    value={email}
                                    className="input pl-10 border-black"
                                    placeholder="you@example.com"
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                        </div>

                        {/* Password */}
                        <div className="grid gap-2">
                            <Label htmlFor="password" className="text-md">Password</Label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <LockClosedIcon className="size-5"/>
                                </div>
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    id="password"
                                    name="password"
                                    className="input pl-10 pr-10 border-black"
                                    value={password}
                                    placeholder="Enter your password"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                                    {
                                        showPassword ? (<EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />) : (<EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />)
                                    }
                                </button>
                            </div>
                            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                        </div>
                    </CardContent>
                    <CardFooter className="relative mt-10">
                        <div className="absolute right-0">
                            <Button type="submit" disabled={loading} className="rounded text-md font-bold cursor-pointer p-4 bg-blue-600 hover:bg-blue-800 mr-6">
                                {loading ? 'Logging in ...' : 'Log in'}
                            </Button>
                        </div>
                    </CardFooter>
                </form>
                <p className="text-center">
                    Don't have an account?{' '}
                    <Link to="/register" className="underline hover:text-blue-600">
                        Register here
                    </Link>
                </p>
                <div className="text-center">
                    <p className="text-xs text-gray-500">
                        Urban Spree Mart © 2025
                    </p>
                </div>
            </Card>
        </div>

    )
}

