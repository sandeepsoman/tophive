
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signUp(email, password, name);
    } catch (error) {
      console.error('Error during sign up:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = (password: string) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const strength = passwordStrength(password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center">
            <span className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">TH</span>
            </span>
          </Link>
          <h1 className="mt-4 text-2xl font-bold">Create an account</h1>
          <p className="mt-2 text-muted-foreground">Sign up to get started with TopHive</p>
        </div>
        
        <Card className="animation-fade-in">
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="focus-within-ring"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="focus-within-ring"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="focus-within-ring"
                />
                {password && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Password strength:</span>
                      <span className={
                        strength === 0 ? "text-destructive" :
                        strength === 1 ? "text-amber-500" :
                        strength === 2 ? "text-amber-500" :
                        strength === 3 ? "text-green-500" :
                        "text-green-600"
                      }>
                        {strength === 0 ? "Weak" :
                         strength === 1 ? "Fair" :
                         strength === 2 ? "Good" :
                         strength === 3 ? "Strong" :
                         "Very strong"}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all ${
                          strength === 0 ? "w-1/4 bg-destructive" :
                          strength === 1 ? "w-2/4 bg-amber-500" :
                          strength === 2 ? "w-3/4 bg-amber-500" :
                          strength === 3 ? "w-full bg-green-500" :
                          "w-full bg-green-600"
                        }`}
                      ></div>
                    </div>
                    <ul className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                      <li className="flex items-center">
                        <CheckCircle 
                          size={12} 
                          className={`mr-1 ${password.length >= 8 ? "text-green-500" : "text-muted-foreground"}`} 
                        />
                        <span>At least 8 characters</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle 
                          size={12} 
                          className={`mr-1 ${/[A-Z]/.test(password) ? "text-green-500" : "text-muted-foreground"}`} 
                        />
                        <span>Uppercase letter</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle 
                          size={12} 
                          className={`mr-1 ${/[0-9]/.test(password) ? "text-green-500" : "text-muted-foreground"}`} 
                        />
                        <span>Number</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle 
                          size={12} 
                          className={`mr-1 ${/[^A-Za-z0-9]/.test(password) ? "text-green-500" : "text-muted-foreground"}`} 
                        />
                        <span>Special character</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full button-press"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/signin" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
