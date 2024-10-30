import { Button } from "../ui/button";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "../ui/form";
import { Input } from "../ui/input";
import { useModal } from "@/hooks/use-modal-store";
import { useToast } from "@/hooks/use-toast";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  icon: z.string().min(1, "Icon is required"),
});

type FormData = z.infer<typeof FormSchema>;

export function CreateGameModal() {
  const { isOpen, type, onClose: onCloseModal } = useModal();

  const { toast } = useToast();

  const isModalOpen = isOpen && type === "createGame";

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      icon: "",
    },
  });

  const { reset: resetForm } = form;

  function onOpenChange(open: boolean) {
    if (open) return;
    onClose();
  }

  function resetFieldValues() {
    resetForm({
      name: "",
      icon: "",
    });
  }

  function onClose() {
    resetFieldValues();
    onCloseModal();
  }

  async function onSubmit() {
    try {
      toast({
        description: "Creating category",
      });

      toast({
        description: "Category created successuflly 🎉",
      });

      onClose();
    } catch (e) {
      toast({
        description: "Couldn't create category. Try later.",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:w-[450px]">
        <DialogHeader>
          <DialogTitle>Create category</DialogTitle>
          <DialogDescription>
            Categories are used to group your transactions
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Category" />
                  </FormControl>
                  <FormDescription>
                    This is how your category will appear in the app
                  </FormDescription>
                </FormItem>
              )}
            />
            <div className="flex gap-2 self-end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => onClose()}
              >
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
