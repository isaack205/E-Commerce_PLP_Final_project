import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeSlashIcon, EnvelopeIcon, UserIcon, LockClosedIcon } from "@heroicons/react/20/solid";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/authContext";
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterPage() {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showConfirmPassword, setShowConfirmPassword] = useState('');
    const [registerError, setRegisterError] = useState(null);
    const [firstnameError, setFirstnameError] = useState('');
    const [lastnameError, setLastnameError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth(); // Get the login function from AuthContext
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setRegisterError(null);
        setFirstnameError('');    // Clear previous errors
        setLastnameError('');
        setUsernameError('')
        setEmailError('');
        setPasswordError('');
        setConfirmPasswordError('');

        // --- FIRST NAME VALIDATION ---
        if (!firstname.trim()) { // .trim() to handle whitespace-only input
            setFirstnameError('First name is required.');
            isValid = false;
        }

        // --- LAST NAME VALIDATION ---
        if (!lastname.trim()) {
            setLastnameError('Last name is required.');
            isValid = false;
        }

        // --- USERNAME VALIDATION ---
        if (!username.trim()) {
            setUsernameError('Username is required.');
            isValid = false;
        }

        // --- EMAIL VALIDATION ---
        if (!email.trim()) {
            setEmailError('Email is required.');
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) { // Simple regex for email format
            setEmailError('Invalid email format.');
            isValid = false;
        }

        // --- PASSWORD VALIDATION ---
        if (!password) {
            setPasswordError('Password is required.');
            isValid = false;
        } else if (password.length < 8) { // Minimum 8 characters
            setPasswordError('Password must be at least 8 characters long.');
            isValid = false;
        } else if (!/[A-Z]/.test(password)) { // At least one uppercase letter
            setPasswordError('Password must contain at least one uppercase letter.');
            isValid = false;
        } else if (!/[a-z]/.test(password)) { // At least one lowercase letter
            setPasswordError('Password must contain at least one lowercase letter.');
            isValid = false;
        } else if (!/[0-9]/.test(password)) { // At least one number
            setPasswordError('Password must contain at least one number.');
            isValid = false;
        } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password)) { // At least one special character
            setPasswordError('Password must contain at least one special character (e.g., !@#$%^&*).');
            isValid = false;
        }

        // --- CONFIRM PASSWORD VALIDATION ---
        if (!confirmPassword) {
            setConfirmPasswordError('Confirm password is required.');
            isValid = false;
        } else if (password !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match.');
            isValid = false;
        }

        // If any validation failed, stop here
        if (!isValid) {
            setLoading(false); // Stop loading if validation failed
            return;
        }

        try {
            await register({firstname, lastname, email, password, confirmPassword});
            navigate('/'); // Redirect to homepage
        } catch (error) {
            setLoginError(err.response?.data?.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    }

    return(
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Create Account!</CardTitle>
                    <CardDescription>Join Urban Spree Mart</CardDescription>
                    {registerError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4" role="alert">
                            {registerError}
                        </div>
                    )}
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent>
                        {/* Firstname */}
                        <div className="grid gap-2">
                            <Label htmlFor="firstname">First name</Label>
                            <div>
                                <UserIcon/>
                                <Input
                                    type="text"
                                    id="firstname"
                                    name="firstname"
                                    value={firstname}
                                    placeholder="firstname"
                                    onChange={(e) => setFirstname(e.target.value)}
                                    required
                                />
                            </div>
                            {firstnameError && <p className="text-red-500 text-sm mt-1">{firstnameError}</p>}
                        </div>

                        {/* Lastname */}
                        <div className="grid gap-2">
                            <Label htmlFor="lastname">Last Name</Label>
                            <div>
                                <UserIcon/>
                                <Input
                                    type="text"
                                    id="lastname"
                                    name="lastname"
                                    value={lastname}
                                    placeholder="lastname"
                                    onChange={(e) => setLastname(e.target.value)}
                                />
                            </div>
                            {lastnameError && <p className="text-red-500 text-sm mt-1">{lastnameError}</p>}
                        </div>

                        {/* Username */}
                        <div className="grid gap-2">
                            <Label htmlFor="lastname">Username</Label>
                            <div>
                                <UserIcon/>
                                <Input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={username}
                                    placeholder="username"
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            {usernameError && <p className="text-red-500 text-sm mt-1">{usernameError}</p>}
                        </div>

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
                                    autoComplete="new-password"
                                    id="password"
                                    name="password"
                                    value={password}
                                    placeholder="choose password"
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

                        {/* Confirm Password */}
                        <div className="grid gap-2">
                            <Label htmlFor="confirmPassword">Confirm password</Label>
                            <div>
                                <LockClosedIcon/>
                                <Input
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'confirmPassword'}
                                    autoComplete="new-password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    placeholder="confirm password"
                                    onchange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    {
                                        showConfirmPassword ? (<EyeSlashIcon />) : (<EyeIcon />)
                                    }
                                </button>
                            </div>
                            {confirmPasswordError && <p className="text-red-500 text-sm mt-1">{confirmPasswordError}</p>}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? ' Creating account...' : 'Create account'}
                        </Button>
                    </CardFooter>
                </form>
                <p>
                    Already have an account?{' '}
                    <Link to="/login">
                        Log in here
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