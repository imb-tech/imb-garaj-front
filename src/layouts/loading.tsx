import Spinner from "@/components/ui/spinner"

const Loading = ({
    children,
    loading,
}: {
    children: React.ReactNode
    loading: boolean
}) => {
    return (
        <>
            {loading ?
                <div className="w-full h-[80vh] flex items-center justify-center">
                    {<Spinner size="responsive" />}
                </div>
            :   children}
        </>
    )
}

export default Loading
