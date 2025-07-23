import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Label } from "@radix-ui/react-label";
import { Button } from "../../components/ui/button";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { instance } from "../../config/ApiService"; // Axios instance with baseURL
import { isLoggedIn } from "../../utils/utils";

export function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    useEffect(() => {
        if (isLoggedIn()) {
            navigate("/home"); // or your protected route
        }
    }, [navigate]);

    const validateForm = () => {
        const { email, password } = formData;

        if (!email || !password) {
            return "Email and password are required.";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return "Invalid email format.";
        }

        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        try {
            const response = await instance.post("/auth/login", {
                username: formData.email, // your backend uses username as email
                password: formData.password,
            });

            // TODO : Create loginResponseType 
            const { token, user } = response.data as {
                token: string;
                user: {
                    id: string,
                    username: string,
                    name: string
                    email: string,
                    role: string,
                    profilePic: string
                }
            };

            localStorage.setItem("auth_token", token);
            localStorage.setItem("user", JSON.stringify(user));

            navigate("/upload"); // replace with your desired route
        } catch (err: any) {
            setError(err?.response?.data?.error || "Login failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-full flex items-center justify-center">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                    <CardAction>
                        <Button variant="default" onClick={() => navigate("/auth/signup")}>
                            Sign Up
                        </Button>
                    </CardAction>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
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
                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        </div>
                        <CardFooter className="flex-col gap-2 mt-4">
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Logging in..." : "Login"}
                            </Button>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
