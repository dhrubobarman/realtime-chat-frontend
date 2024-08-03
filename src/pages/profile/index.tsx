import { useNavigate } from 'react-router-dom';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn, colors } from '@/lib/utils';
import { useAppStore } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { apiCLient } from '@/lib/api-client';
import { UPDATE_PROFILE } from '@/utils/constants';
import { toast } from 'sonner';
import axios, { AxiosError } from 'axios';

const formSchema = z.object({
  firstName: z.string().min(1, { message: 'Required' }),
  lastName: z.string().min(1, { message: 'Required' }),
  color: z.number().max(3).optional().default(0)
});

type FormSchema = z.infer<typeof formSchema>;

const Profile = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: userInfo?.firstName || '',
      lastName: userInfo?.lastName || '',
      color: userInfo?.color || 0
    }
  });

  const handleSave = async (value: FormSchema) => {
    try {
      const response = await apiCLient.patch(UPDATE_PROFILE, value);
      if (response.data.user) {
        toast('Success', {
          description: response.data.message,
          important: true
        });
        setUserInfo(response.data.user);
        form.reset();
        navigate('/chat');
      }
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        toast('Something went wrong', {
          description: e.response?.data?.message || e.message
        });
      }
      toast('Something went wrong');
    }
  };

  const selectedColorIndex = form.watch('color');
  const firstName = form.watch('firstName');
  const isDisabled = !form.formState.isDirty || form.formState.isSubmitting || image === userInfo?.image;

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {};
  const deleteFile = async () => {};

  return (
    <div className="container flex min-h-screen items-center justify-center">
      <input type="file" className="sr-only" id="file-input" onChange={uploadFile} />
      <div className="card w-full max-w-[600px] rounded-lg bg-primary-foreground px-5 py-[40px]">
        <div className="flex w-full flex-wrap gap-4">
          <div className="mt-2 flex-shrink-0">
            <Avatar className={`group relative size-[80px] text-3xl font-medium ${colors[selectedColorIndex]}`}>
              {image ? (
                <AvatarImage src={image} alt={userInfo?.email} />
              ) : (
                <AvatarFallback className="uppercase">{firstName ? `${firstName[0]}` : `${userInfo?.email?.[0]}`}</AvatarFallback>
              )}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                {image ? (
                  <Button variant={'ghost'} size={'icon'} className="size-[80px]" onClick={deleteFile}>
                    <Trash />
                  </Button>
                ) : (
                  <Button variant={'ghost'} size={'icon'} className="size-[80px]" asChild>
                    <label htmlFor="file-input" className="cursor-pointer">
                      <Plus />
                    </label>
                  </Button>
                )}
              </div>
            </Avatar>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSave)} className="min-w-[min(300px,_100%)] flex-grow space-y-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="First Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Last Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" value={userInfo?.email} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <>
                    <FormItem>
                      <Tabs
                        defaultValue="account"
                        {...field}
                        value={`${field.value}`}
                        onValueChange={(value) => {
                          field.onChange(Number(value));
                        }}
                      >
                        <TabsList className="grid max-w-fit grid-cols-4 gap-2 bg-transparent">
                          {colors.map((c, index) => (
                            <TabsTrigger key={index} value={`${index}`} className="size-10 rounded-full p-2">
                              <span className={cn('block size-6 rounded-full', c)}></span>
                            </TabsTrigger>
                          ))}
                        </TabsList>
                      </Tabs>
                    </FormItem>
                  </>
                )}
              />
              <span>
                <Button className="mt-4 w-full" type="submit" disabled={isDisabled}>
                  Save changes
                </Button>
              </span>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
