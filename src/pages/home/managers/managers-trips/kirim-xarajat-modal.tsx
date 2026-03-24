import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/datatable"
import Modal from "@/components/custom/modal"
import ParamTabs from "@/components/as-params/tabs"
import { formatMoney } from "@/lib/format-money"
import { cn } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"
import { Plus } from "lucide-react"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { FormCombobox } from "@/components/form/combobox"
import { FormNumberInput } from "@/components/form/number-input"
import { FormDatePicker } from "@/components/form/date-picker"
import FormTextarea from "@/components/form/textarea"
import { useModal } from "@/hooks/useModal"
import { toast } from "sonner"

// ──── Types ────

type FinanceRow = {
    id: number
    author_name: string
    amount: number
    date: string
    body: string
    created_at: string
    category_name: string
    category_id: number
}

type Category = {
    id: number
    name: string
    amount: number
}

// ──── Hardcoded categories ────

const incomeCategories: Category[] = [
    { id: 1, name: "Reys tushumi", amount: 87500000 },
    { id: 2, name: "Qo'shimcha tushum", amount: 18200000 },
    { id: 3, name: "Boshqa tushum", amount: 5100000 },
]

const expenseCategories: Category[] = [
    { id: 4, name: "Yoqilg'i", amount: 42300000 },
    { id: 5, name: "Ta'mirlash", amount: 18500000 },
    { id: 6, name: "Oylik", amount: 15200000 },
    { id: 7, name: "Boshqa xarajat", amount: 6850000 },
]

// ──── Hardcoded data (25 each) ────

const incomeData: FinanceRow[] = [
    { id: 1, author_name: "Ahmad Abdurahimov", amount: 5000000, date: "2025-11-25", body: "Yuk tashish to'lovi", created_at: "2025-11-25 10:30", category_name: "Reys tushumi", category_id: 1 },
    { id: 2, author_name: "Sardor Karimov", amount: 3200000, date: "2025-11-26", body: "Qo'shimcha xizmat", created_at: "2025-11-26 14:00", category_name: "Qo'shimcha tushum", category_id: 2 },
    { id: 3, author_name: "Ahmad Abdurahimov", amount: 7800000, date: "2025-11-27", body: "Samarqand reysi", created_at: "2025-11-27 09:15", category_name: "Reys tushumi", category_id: 1 },
    { id: 4, author_name: "Jasur Mirzaev", amount: 1500000, date: "2025-11-28", body: "Yukni saqlash xizmati", created_at: "2025-11-28 16:45", category_name: "Qo'shimcha tushum", category_id: 2 },
    { id: 5, author_name: "Sardor Karimov", amount: 4200000, date: "2025-11-29", body: "Buxoro reysi", created_at: "2025-11-29 11:20", category_name: "Reys tushumi", category_id: 1 },
    { id: 6, author_name: "Bobur Xasanov", amount: 6100000, date: "2025-11-30", body: "Toshkent-Namangan", created_at: "2025-11-30 08:00", category_name: "Reys tushumi", category_id: 1 },
    { id: 7, author_name: "Jasur Mirzaev", amount: 2800000, date: "2025-12-01", body: "Qo'shimcha transport", created_at: "2025-12-01 12:30", category_name: "Qo'shimcha tushum", category_id: 2 },
    { id: 8, author_name: "Ahmad Abdurahimov", amount: 9500000, date: "2025-12-02", body: "Navoiy reysi", created_at: "2025-12-02 07:45", category_name: "Reys tushumi", category_id: 1 },
    { id: 9, author_name: "Nodira Karimova", amount: 1800000, date: "2025-12-03", body: "Ijaraga berish", created_at: "2025-12-03 15:20", category_name: "Boshqa tushum", category_id: 3 },
    { id: 10, author_name: "Sardor Karimov", amount: 5500000, date: "2025-12-04", body: "Farg'ona reysi", created_at: "2025-12-04 09:00", category_name: "Reys tushumi", category_id: 1 },
    { id: 11, author_name: "Bobur Xasanov", amount: 3400000, date: "2025-12-05", body: "Xorazm reysi", created_at: "2025-12-05 11:15", category_name: "Reys tushumi", category_id: 1 },
    { id: 12, author_name: "Ahmad Abdurahimov", amount: 2200000, date: "2025-12-06", body: "Yukni tushirish xizmati", created_at: "2025-12-06 14:30", category_name: "Qo'shimcha tushum", category_id: 2 },
    { id: 13, author_name: "Jasur Mirzaev", amount: 8200000, date: "2025-12-07", body: "Andijon reysi", created_at: "2025-12-07 06:50", category_name: "Reys tushumi", category_id: 1 },
    { id: 14, author_name: "Nodira Karimova", amount: 1200000, date: "2025-12-08", body: "Qo'shimcha tushum", created_at: "2025-12-08 17:00", category_name: "Boshqa tushum", category_id: 3 },
    { id: 15, author_name: "Sardor Karimov", amount: 4800000, date: "2025-12-09", body: "Jizzax reysi", created_at: "2025-12-09 08:20", category_name: "Reys tushumi", category_id: 1 },
    { id: 16, author_name: "Ahmad Abdurahimov", amount: 6700000, date: "2025-12-10", body: "Termiz reysi", created_at: "2025-12-10 10:10", category_name: "Reys tushumi", category_id: 1 },
    { id: 17, author_name: "Bobur Xasanov", amount: 2900000, date: "2025-12-11", body: "Qashqadaryo reysi", created_at: "2025-12-11 13:40", category_name: "Reys tushumi", category_id: 1 },
    { id: 18, author_name: "Jasur Mirzaev", amount: 1600000, date: "2025-12-12", body: "Yuklarni saqlash", created_at: "2025-12-12 16:15", category_name: "Qo'shimcha tushum", category_id: 2 },
    { id: 19, author_name: "Sardor Karimov", amount: 7300000, date: "2025-12-13", body: "Sirdaryo reysi", created_at: "2025-12-13 07:30", category_name: "Reys tushumi", category_id: 1 },
    { id: 20, author_name: "Nodira Karimova", amount: 950000, date: "2025-12-14", body: "Boshqa xizmat", created_at: "2025-12-14 11:50", category_name: "Boshqa tushum", category_id: 3 },
    { id: 21, author_name: "Ahmad Abdurahimov", amount: 5400000, date: "2025-12-15", body: "Nukus reysi", created_at: "2025-12-15 09:25", category_name: "Reys tushumi", category_id: 1 },
    { id: 22, author_name: "Bobur Xasanov", amount: 3100000, date: "2025-12-16", body: "Guliston reysi", created_at: "2025-12-16 14:00", category_name: "Reys tushumi", category_id: 1 },
    { id: 23, author_name: "Jasur Mirzaev", amount: 4600000, date: "2025-12-17", body: "Qarshi reysi", created_at: "2025-12-17 08:40", category_name: "Reys tushumi", category_id: 1 },
    { id: 24, author_name: "Sardor Karimov", amount: 2100000, date: "2025-12-18", body: "Transport xizmati", created_at: "2025-12-18 12:00", category_name: "Qo'shimcha tushum", category_id: 2 },
    { id: 25, author_name: "Ahmad Abdurahimov", amount: 8800000, date: "2025-12-19", body: "Samarqand-Buxoro", created_at: "2025-12-19 06:30", category_name: "Reys tushumi", category_id: 1 },
]

const expenseData: FinanceRow[] = [
    { id: 1, author_name: "Ahmad Abdurahimov", amount: 2500000, date: "2025-11-25", body: "Yoqilg'i xarajati", created_at: "2025-11-25 08:30", category_name: "Yoqilg'i", category_id: 4 },
    { id: 2, author_name: "Sardor Karimov", amount: 800000, date: "2025-11-26", body: "Shina almashtirish", created_at: "2025-11-26 13:00", category_name: "Ta'mirlash", category_id: 5 },
    { id: 3, author_name: "Ahmad Abdurahimov", amount: 1200000, date: "2025-11-27", body: "Moy almashtirish", created_at: "2025-11-27 10:45", category_name: "Ta'mirlash", category_id: 5 },
    { id: 4, author_name: "Jasur Mirzaev", amount: 350000, date: "2025-11-28", body: "Yo'l to'lovi", created_at: "2025-11-28 15:30", category_name: "Boshqa xarajat", category_id: 7 },
    { id: 5, author_name: "Ahmad Abdurahimov", amount: 3000000, date: "2025-11-29", body: "Dizel yoqilg'i", created_at: "2025-11-29 07:00", category_name: "Yoqilg'i", category_id: 4 },
    { id: 6, author_name: "Sardor Karimov", amount: 450000, date: "2025-11-30", body: "Kunlik xarajat", created_at: "2025-11-30 18:00", category_name: "Boshqa xarajat", category_id: 7 },
    { id: 7, author_name: "Bobur Xasanov", amount: 1800000, date: "2025-12-01", body: "Tormoz ta'mirlash", created_at: "2025-12-01 09:20", category_name: "Ta'mirlash", category_id: 5 },
    { id: 8, author_name: "Ahmad Abdurahimov", amount: 4200000, date: "2025-12-02", body: "Dizel Navoiy reysi", created_at: "2025-12-02 06:15", category_name: "Yoqilg'i", category_id: 4 },
    { id: 9, author_name: "Jasur Mirzaev", amount: 600000, date: "2025-12-03", body: "Yo'l jarima", created_at: "2025-12-03 14:50", category_name: "Boshqa xarajat", category_id: 7 },
    { id: 10, author_name: "Nodira Karimova", amount: 5000000, date: "2025-12-04", body: "Haydovchi oyligi", created_at: "2025-12-04 17:00", category_name: "Oylik", category_id: 6 },
    { id: 11, author_name: "Sardor Karimov", amount: 2200000, date: "2025-12-05", body: "Akkumulyator almashtirish", created_at: "2025-12-05 10:30", category_name: "Ta'mirlash", category_id: 5 },
    { id: 12, author_name: "Ahmad Abdurahimov", amount: 3500000, date: "2025-12-06", body: "Metan yoqilg'i", created_at: "2025-12-06 07:45", category_name: "Yoqilg'i", category_id: 4 },
    { id: 13, author_name: "Bobur Xasanov", amount: 750000, date: "2025-12-07", body: "Avtomoyka", created_at: "2025-12-07 16:20", category_name: "Boshqa xarajat", category_id: 7 },
    { id: 14, author_name: "Jasur Mirzaev", amount: 1500000, date: "2025-12-08", body: "Filtr almashtirish", created_at: "2025-12-08 11:00", category_name: "Ta'mirlash", category_id: 5 },
    { id: 15, author_name: "Sardor Karimov", amount: 2800000, date: "2025-12-09", body: "Dizel Jizzax reysi", created_at: "2025-12-09 06:30", category_name: "Yoqilg'i", category_id: 4 },
    { id: 16, author_name: "Nodira Karimova", amount: 5200000, date: "2025-12-10", body: "Haydovchi oyligi", created_at: "2025-12-10 17:30", category_name: "Oylik", category_id: 6 },
    { id: 17, author_name: "Ahmad Abdurahimov", amount: 900000, date: "2025-12-11", body: "Parkovka to'lovi", created_at: "2025-12-11 13:15", category_name: "Boshqa xarajat", category_id: 7 },
    { id: 18, author_name: "Bobur Xasanov", amount: 3800000, date: "2025-12-12", body: "Dvigatel ta'mirlash", created_at: "2025-12-12 08:50", category_name: "Ta'mirlash", category_id: 5 },
    { id: 19, author_name: "Sardor Karimov", amount: 2100000, date: "2025-12-13", body: "Dizel Sirdaryo", created_at: "2025-12-13 07:00", category_name: "Yoqilg'i", category_id: 4 },
    { id: 20, author_name: "Jasur Mirzaev", amount: 400000, date: "2025-12-14", body: "Kunlik ovqat", created_at: "2025-12-14 12:30", category_name: "Boshqa xarajat", category_id: 7 },
    { id: 21, author_name: "Ahmad Abdurahimov", amount: 4500000, date: "2025-12-15", body: "Dizel Nukus reysi", created_at: "2025-12-15 06:00", category_name: "Yoqilg'i", category_id: 4 },
    { id: 22, author_name: "Nodira Karimova", amount: 5000000, date: "2025-12-16", body: "Haydovchi oyligi", created_at: "2025-12-16 18:00", category_name: "Oylik", category_id: 6 },
    { id: 23, author_name: "Bobur Xasanov", amount: 1300000, date: "2025-12-17", body: "Elektr ta'mirlash", created_at: "2025-12-17 10:40", category_name: "Ta'mirlash", category_id: 5 },
    { id: 24, author_name: "Sardor Karimov", amount: 550000, date: "2025-12-18", body: "Yo'l to'lovi", created_at: "2025-12-18 15:00", category_name: "Boshqa xarajat", category_id: 7 },
    { id: 25, author_name: "Ahmad Abdurahimov", amount: 3200000, date: "2025-12-19", body: "Metan yoqilg'i", created_at: "2025-12-19 07:20", category_name: "Yoqilg'i", category_id: 4 },
]

// ──── Category tabs component ────

function CategoryTabs({
    categories,
    selectedId,
    onSelect,
    onAdd,
}: {
    categories: Category[]
    selectedId: number | null
    onSelect: (id: number) => void
    onAdd: () => void
}) {
    return (
        <div className="flex items-stretch gap-3 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
                <div
                    key={cat.id}
                    onClick={() => onSelect(cat.id)}
                    className={cn(
                        "px-4 py-3 min-w-36 border rounded-md text-center cursor-pointer hover:border-primary transition-colors shrink-0",
                        selectedId === cat.id && "border-primary bg-primary/5",
                    )}
                >
                    <p className="text-sm">{cat.name}</p>
                    <p className="font-semibold">{formatMoney(cat.amount)}</p>
                </div>
            ))}
            <div
                onClick={onAdd}
                className={cn(
                    "px-2 py-3 min-w-20 border border-dashed border-primary rounded-md text-sm flex items-center justify-center cursor-pointer hover:bg-secondary shrink-0",
                )}
            >
                <Plus className="text-primary size-8" />
            </div>
        </div>
    )
}

// ──── Add form (hardcoded, mirrors IMB-CRM create.tsx) ────

function AddFinanceForm({
    type,
    categories,
}: {
    type: "tushum" | "xarajat"
    categories: Category[]
}) {
    const { closeModal } = useModal("kirim-xarajat-add")
    const form = useForm()
    const { handleSubmit, control, reset } = form

    const onSubmit = () => {
        toast.success(
            type === "tushum"
                ? "Tushum muvaffaqiyatli qo'shildi"
                : "Xarajat muvaffaqiyatli qo'shildi",
        )
        reset()
        closeModal()
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
            <FormCombobox
                control={control}
                required
                labelKey="name"
                valueKey="id"
                name="category"
                options={categories}
                label={type === "tushum" ? "Tushum turi" : "Chiqim turi"}
            />
            <FormNumberInput
                required
                control={control}
                label="Summa"
                name="amount"
                placeholder="Ex: 123 000"
                thousandSeparator=" "
                decimalScale={0}
            />
            <FormDatePicker
                required
                label="Sana"
                control={control}
                name="date"
            />
            <FormTextarea required label="Izoh" methods={form} name="body" />
            <Button className="w-full" type="submit">
                Saqlash
            </Button>
        </form>
    )
}

// ──── Columns ────

const useIncomeCols = () => {
    return useMemo<ColumnDef<FinanceRow>[]>(
        () => [
            { header: "Mas'ul shaxs", accessorKey: "author_name", enableSorting: true },
            {
                header: "Summa",
                accessorKey: "amount",
                enableSorting: true,
                cell: ({ row }) => (
                    <span className="text-green-500 font-medium">
                        {formatMoney(row.original.amount)}
                    </span>
                ),
            },
            { header: "Sana", accessorKey: "date", enableSorting: true },
            { header: "Izoh", accessorKey: "body", enableSorting: true },
            { header: "Yaratilgan sana", accessorKey: "created_at", enableSorting: true },
        ],
        [],
    )
}

const useExpenseCols = () => {
    return useMemo<ColumnDef<FinanceRow>[]>(
        () => [
            { header: "Mas'ul shaxs", accessorKey: "author_name", enableSorting: true },
            {
                header: "Summa",
                accessorKey: "amount",
                enableSorting: true,
                cell: ({ row }) => (
                    <span className="text-red-500 font-medium">
                        - {formatMoney(row.original.amount)}
                    </span>
                ),
            },
            { header: "Sana", accessorKey: "date", enableSorting: true },
            { header: "Izoh", accessorKey: "body", enableSorting: true },
            { header: "Yaratilgan sana", accessorKey: "created_at", enableSorting: true },
        ],
        [],
    )
}

// ──── Tab content components ────

function IncomeTab() {
    const columns = useIncomeCols()
    const [selectedCat, setSelectedCat] = useState<number | null>(incomeCategories[0].id)
    const { openModal } = useModal("kirim-xarajat-add")

    const filtered = selectedCat
        ? incomeData.filter((r) => r.category_id === selectedCat)
        : incomeData

    const handleAdd = () => {
        openModal()
    }

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="shrink-0">
                <CategoryTabs
                    categories={incomeCategories}
                    selectedId={selectedCat}
                    onSelect={setSelectedCat}
                    onAdd={handleAdd}
                />
            </div>
            <div className="mt-4 flex-1 overflow-y-auto min-h-0">
                <DataTable
                    columns={columns}
                    data={filtered}
                    numeration
                    head={
                        <div className="flex mb-3 justify-between items-center gap-3">
                            <div className="flex items-center gap-3">
                                <h1 className="text-xl">Tushum tarixi</h1>
                                <Badge className="text-sm">{filtered.length}</Badge>
                            </div>
                            <Button onClick={handleAdd}>
                                <Plus size={18} />
                                Tushum qo'shish
                            </Button>
                        </div>
                    }
                    paginationProps={{ totalPages: 1 }}
                />
            </div>
        </div>
    )
}

function ExpenseTab() {
    const columns = useExpenseCols()
    const [selectedCat, setSelectedCat] = useState<number | null>(expenseCategories[0].id)
    const { openModal } = useModal("kirim-xarajat-add")

    const filtered = selectedCat
        ? expenseData.filter((r) => r.category_id === selectedCat)
        : expenseData

    const handleAdd = () => {
        openModal()
    }

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="shrink-0">
                <CategoryTabs
                    categories={expenseCategories}
                    selectedId={selectedCat}
                    onSelect={setSelectedCat}
                    onAdd={handleAdd}
                />
            </div>
            <div className="mt-4 flex-1 overflow-y-auto min-h-0">
                <DataTable
                    columns={columns}
                    data={filtered}
                    numeration
                    head={
                        <div className="flex mb-3 justify-between items-center gap-3">
                            <div className="flex items-center gap-3">
                                <h1 className="text-xl">Xarajatlar tarixi</h1>
                                <Badge className="text-sm">{filtered.length}</Badge>
                            </div>
                            <Button onClick={handleAdd}>
                                <Plus size={18} />
                                Xarajat qo'shish
                            </Button>
                        </div>
                    }
                    paginationProps={{ totalPages: 1 }}
                />
            </div>
        </div>
    )
}

// ──── Main export ────

export default function KirimXarajatContent() {
    const [currentType, setCurrentType] = useState<"tushum" | "xarajat">("tushum")

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <ParamTabs
                paramName="moliya_tab"
                className="shrink-0"
                onValueChange={(val) => setCurrentType(val as "tushum" | "xarajat")}
                options={[
                    {
                        value: "tushum",
                        label: "Tushum",
                        content: <IncomeTab />,
                    },
                    {
                        value: "xarajat",
                        label: "Xarajat",
                        content: <ExpenseTab />,
                    },
                ]}
            />

            <Modal
                modalKey="kirim-xarajat-add"
                title={currentType === "tushum" ? "Tushum qo'shish" : "Xarajat qo'shish"}
                size="max-w-md"
            >
                <AddFinanceForm
                    type={currentType}
                    categories={currentType === "tushum" ? incomeCategories : expenseCategories}
                />
            </Modal>
        </div>
    )
}
