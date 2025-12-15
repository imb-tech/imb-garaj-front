import FormInput from "@/components/form/input"
import { Button } from "@/components/ui/button"
import { useDownloadAsExcel } from "@/hooks/useDownloadAsExcel"
import { useSearch } from "@tanstack/react-router"
import { useForm } from "react-hook-form"

export default function CodeConfirmForm() {
    const form = useForm<{ password: string }>()
    const search: any = useSearch({ from: "__root__" })

    const { downloadWithPassword, isFetching } = useDownloadAsExcel(search?.downloadUrl)

    const handleSubmit = (vals: { password: string }) => {
        downloadWithPassword(vals.password, search?.downloadUrl)
    }

    return (
        <form
            className="w-full flex flex-col gap-3"
            onSubmit={form.handleSubmit(handleSubmit)}
        >
            <FormInput methods={form} name="password" placeholder="Parol" />
            <Button type="submit" loading={isFetching}>Yuklab olish</Button>
        </form>
    )
}
