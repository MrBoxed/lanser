import { Label } from "@radix-ui/react-label";
import { Button } from "../../components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { instance } from "../../config/ApiService";
import { isLoggedIn } from "../../utils/utils";

// Type for form data
type SignUpFormData = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export function SignUp() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<SignUpFormData>({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (isLoggedIn()) {
            navigate("/upload"); // or your protected route
        }
    }, [navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const validateForm = (data: SignUpFormData): string | null => {
        const { name, email, password, confirmPassword } = data;

        if (!name || !email || !password || !confirmPassword) {
            return "All fields are required.";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return "Invalid email format.";
        }

        if (password.length < 6) {
            return "Password must be at least 6 characters.";
        }

        if (password !== confirmPassword) {
            return "Passwords do not match.";
        }

        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        const validationError = validateForm(formData);
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);

        try {
            const { name, email, password } = formData;

            console.log("submiting" + JSON.stringify(formData));

            // Replace with your actual API endpoint
            const response = await instance.post("/auth/signup", {
                name,
                email,
                password,
            });

            console.log("Signup successful:", response.data);

            // redirect after success
            if (response.status == 201)
                navigate("/auth/login");

        } catch (err: any) {

            setError(err.response?.data?.message || "Signup failed.");
            console.log(err);

            setError("An unknown error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-full flex items-center justify-center">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Create your account</CardTitle>
                    <CardDescription>
                        Enter your email below to sign up for Lanser
                    </CardDescription>
                    <CardAction>
                        <Button variant="default" onClick={() => navigate("/auth/login")}>
                            Login
                        </Button>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {error && (
                                <p className="text-red-500 text-sm text-center">{error}</p>
                            )}
                        </div>

                        <CardFooter className="flex-col gap-2 mt-4">
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Signing Up..." : "Sign Up"}
                            </Button>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}