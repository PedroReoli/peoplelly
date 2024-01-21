// EventCreationForm.tsx
import React from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

import { EventValidation } from "@/lib/validation";
import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
// import { Loader } from "@/components/shared/";
import { useCreateEvent } from "@/lib/react-query/queries";

type EventCreationFormProps = {
  onCancel: () => void;
};

const EventCreationForm: React.FC<EventCreationFormProps> = ({ onCancel }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUserContext();
  const form = useForm<z.infer<typeof EventValidation>>({
    resolver: zodResolver(EventValidation),
    defaultValues: {
      title: "",
      description: "",
      date: "", // Fornecer um valor padrão aqui
      location: "",
      users: "", // Adicione esta linha
      package: "", // Adicione esta linha
    },
  });
  const { mutateAsync: createEvent, isLoading: isLoadingCreate } = useCreateEvent();

  const handleSubmit = async (value: z.infer<typeof EventValidation>) => {
    const newEvent = await createEvent({
      userId: user.id,
      date: value.date ? new Date(value.date) : new Date(), // Definir uma data padrão se for nulo
      title: value.title,
      description: value.description,
      location: value.location,
      participants: value.participants,
    });

    if (!newEvent) {
      toast({
        title: "Create event failed. Please try again.",
      });
    } else {
      onCancel();
    }
  };

  return (
    <Form {...form}>
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className="flex flex-col gap-9 w-full  max-w-5xl">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="shad-form_label">Title</FormLabel>
            <FormControl>
              <Input type="text" className="shad-input" {...field} />
            </FormControl>
            <FormMessage className="shad-form_message" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="shad-form_label">Description</FormLabel>
            <FormControl>
              <Input type="text" className="shad-input" {...field} />
            </FormControl>
            <FormMessage className="shad-form_message" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="users"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="shad-form_label">Users</FormLabel>
            <FormControl>
              {/* Adicione o componente de seleção de usuários aqui */}
              <Input type="text" className="shad-input" {...field} />
            </FormControl>
            <FormMessage className="shad-form_message" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="shad-form_label">Location</FormLabel>
            <FormControl>
              <Input type="text" className="shad-input" {...field} />
            </FormControl>
            <FormMessage className="shad-form_message" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="date"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="shad-form_label">Date</FormLabel>
            <FormControl>
              <Input
                type="datetime-local"
                className="shad-input"
                {...field}
                value={field.value || ""} // Garante que o valor seja uma string vazia se for nulo
              />
            </FormControl>
            <FormMessage className="shad-form_message" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="package"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="shad-form_label">Package</FormLabel>
            <FormControl>
              {/* Adicione o componente de seleção de pacotes aqui */}
              <Input type="text" className="shad-input" {...field} />
            </FormControl>
            <FormMessage className="shad-form_message" />
          </FormItem>
        )}
      />

      {/* Outros campos... */}

    </form>
  </Form>
  );
};

export default EventCreationForm;
