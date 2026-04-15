import { FormCombobox } from "@/components/form/combobox"
import FormInput from "@/components/form/input"
import { Button } from "@/components/ui/button"
import { SETTINGS_ROLES, SETTINGS_USERS } from "@/constants/api-endpoints"
import { useGet } from "@/hooks/useGet"
import { usePatch } from "@/hooks/usePatch"
import { usePost } from "@/hooks/usePost"
import { useNavigate, useParams } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"
import PermissionField from "./permission-field"

const UserFormPage = () => {
    const navigate = useNavigate()
    const { id } = useParams({ strict: false })

    const { data: userData } = useGet<UserType>(
        id ? `${SETTINGS_USERS}/${id}` : "",
        { enabled: !!id },
    )
    const { data: userRole } = useGet(SETTINGS_ROLES)

    const form = useForm<UserType>({
        values: id && userData ? { ...userData, password: "" } : undefined,
        defaultValues: {
            first_name: "",
            last_name: "",
            username: "",
            password: "",
            role: undefined,
            actions: [],
        },
    })

    const { handleSubmit, control } = form

    const selectedRole = useWatch({ control, name: "role" })
    const selectedRoleName = (userRole?.results as { id: number; name: string }[])
        ?.find((r) => r.id === selectedRole)?.name
    const isDriver = selectedRoleName?.toLowerCase() === "driver"

    const onSuccess = () => {
        toast.success(
            id ? "Foydalanuvchi tahrirlandi!" : "Foydalanuvchi qo'shildi!",
        )
        navigate({ to: "/users" })
    }

    const { mutate: postMutate, isPending: isPendingCreate } = usePost({ onSuccess })
    const { mutate: updateMutate, isPending: isPendingUpdate } = usePatch({ onSuccess })
    const isPending = isPendingCreate || isPendingUpdate

    const onSubmit = (values: UserType) => {
        if (id) {
            const { password, ...rest } = values
            updateMutate(`${SETTINGS_USERS}/${id}`, password ? values : rest)
        } else {
            postMutate(SETTINGS_USERS, values)
        }
    }

    return (
        <div className="p-4">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: "/users" })}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
            >
                <ArrowLeft size={18} />
                <span>Foydalanuvchilar</span>
            </Button>

            <h1 className="text-xl font-semibold mb-6">
                {id ? "Foydalanuvchini tahrirlash" : "Yangi foydalanuvchi"}
            </h1>

            <FormProvider {...form}>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    <FormInput
                        required
                        name="first_name"
                        label="Ism"
                        methods={form}
                        placeholder="Misol: Ali"
                    />
                    <FormInput
                        required
                        name="last_name"
                        label="Familiya"
                        methods={form}
                        placeholder="Misol: Aliyev"
                    />
                    <FormInput
                        required
                        name="username"
                        label="Login"
                        methods={form}
                        placeholder="Misol: ali1"
                    />
                    <FormInput
                        required={!id}
                        type="password"
                        name="password"
                        label="Parol"
                        methods={form}
                        placeholder={
                            id
                                ? "O'zgartirish uchun kiriting"
                                : "Misol: SecurePass123!"
                        }
                    />
                    <FormCombobox
                        options={userRole?.results ?? []}
                        name="role"
                        control={form.control}
                        labelKey="name"
                        valueKey="id"
                        label="Foydalanuvchi roli"
                    />

                    {!isDriver && (
                        <div className="md:col-span-2">
                            <PermissionField />
                        </div>
                    )}

                    <div className="md:col-span-2 flex justify-end pt-4">
                        <Button
                            className="min-w-36"
                            type="submit"
                            loading={isPending}
                        >
                            Saqlash
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </div>
    )
}

export default UserFormPage
