import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

import { apiCLient } from '@/lib/api-client';
import { useAppStore } from '@/store';
import { LOGIN_ROUTE, SIGNUP_ROUTE } from '@/utils/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password has to be atlease 8 characters long')
});

const signupSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8, 'Password has to be atlease 8 characters long'),
    confirm: z.string()
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ['confirm']
  });

type LoginSchema = z.infer<typeof loginSchema>;
type SignupSchema = z.infer<typeof signupSchema>;

const Auth = () => {
  const { setUserInfo } = useAppStore();
  const loginForm = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const signupForm = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirm: ''
    }
  });

  const handleLogin = (value: LoginSchema) => {
    apiCLient
      .post(LOGIN_ROUTE, value)
      .then((response) => {
        toast('Success', {
          description: response.data.message,
          important: true
        });
        loginForm.reset();
        if (response.data.user.id) {
          setUserInfo(response.data.user);
        }
      })
      .catch((e) => {
        toast('Something went wrong', {
          description: e.response?.data?.message || e.message
        });
      });
  };

  const handleSignup = async (value: SignupSchema) => {
    apiCLient
      .post(SIGNUP_ROUTE, { email: value.email, password: value.password })
      .then((response) => {
        toast('Success', {
          description: response.data.message,
          important: true
        });
        signupForm.reset();
        if (response.status === 201) {
          setUserInfo(response.data.user);
        }
      })
      .catch((e) => {
        toast('Something went wrong', {
          description: e.response?.data?.message || e.message
        });
      });
  };

  return (
    <div className="min-w-screen flex min-h-screen items-center justify-center p-2">
      <Tabs defaultValue="login" className="w-[500px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Signup</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Welcome ✌️</CardTitle>
              <CardDescription>Fill in the details to start with the chat app</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-3">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="johndoe@mail.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input placeholder="johndoe@mail.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="block w-full rounded-full">
                    Login
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Signup ✌️</CardTitle>
              <CardDescription>Fill in the details to create an account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Form {...signupForm}>
                <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-3">
                  <FormField
                    control={signupForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="johndoe@mail.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input placeholder="johndoe@mail.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signupForm.control}
                    name="confirm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input placeholder="johndoe@mail.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="block w-full rounded-full">
                    Sign up
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Auth;
