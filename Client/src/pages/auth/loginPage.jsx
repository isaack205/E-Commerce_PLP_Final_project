import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeSlashIcon, EnvelopeIcon, LockClosedIcon } from "@heroicons/react/20/solid";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
            setLoginError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    }

    return(
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Welcome Back!</CardTitle>
                    <CardDescription>Sign in to your account</CardDescription>
                    {loginError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4" role="alert">
                            {loginError}
                        </div>
                    )}
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent>
                        {/* Email */}
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div>
                                <EnvelopeIcon/>
                                <Input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    placeholder="you@example.com"
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                        </div>

                        {/* Password */}
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <div>
                                <LockClosedIcon/>
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    id="password"
                                    name="password"
                                    value={password}
                                    placeholder="**********"
                                    onchange={(e) => setPassword(e.target.value)}
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                                    {
                                        showPassword ? (<EyeSlashIcon />) : (<EyeIcon />)
                                    }
                                </button>
                            </div>
                            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Logging in ...' : 'Log in'}
                        </Button>
                    </CardFooter>
                </form>
                <p>
                    Don't have an account?{' '}
                    <Link to="/register">
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

