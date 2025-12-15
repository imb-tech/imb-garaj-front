import { useNavigate, useSearch } from "@tanstack/react-router"
import { Search } from "lucide-react"
import { useEffect, useRef } from "react"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"

const SearchInput = ({
    showInput,
    setShowInput,
    type,
    paramName = 'search'
}: {
    showInput: boolean;
    setShowInput: (value: boolean) => void;
    type?: string;
    paramName?: string
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const params: any = useSearch({ strict: false });

    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    const handleSearchToggle = () => {
        setShowInput(true)
        setTimeout(() => inputRef.current?.focus(), 0)
    }

    const handleBlur = () => {
        if (inputRef.current?.value === "") {
            setShowInput(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchTerm = e.target.value

        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current)
        }
        debounceTimeoutRef.current = setTimeout(() => {
            if (newSearchTerm === "") {
                navigate({
                    search: {
                        ...params,
                        [paramName]: undefined,
                        search_term: undefined,
                    },
                } as any)
            } else {
                navigate({
                    search: { ...params, [paramName]: newSearchTerm },
                } as any);
            }
        }, 300)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            const searchValue = inputRef.current?.value
            if (searchValue) {
                navigate({
                    search: {
                        ...params,
                        [paramName]: searchValue,
                        search_term: searchValue,
                    },
                } as any)
            } else {
                navigate({
                    search: {
                        ...params,
                        [paramName]: undefined,
                        search_term: undefined,
                    },
                } as any)
            }
        }
    }

    useEffect(() => {
        if (params[paramName] || params.search_term) {
            setShowInput(true);
            if (inputRef.current) {
                inputRef.current.value =
                    params[paramName] || params.search_term || "";
            }
        } else {
            if (inputRef.current) {
                inputRef.current.value = ""
            }
        }
    }, [params[paramName], params.search_term, inputRef.current]);

    return (
        <>
            {showInput ?
                <Input
                    placeholder="Qidiruv..."
                    type="search"
                    className="bg-transparent"
                    ref={inputRef}
                    onBlur={handleBlur}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                />
            :   <Button
                    icon={<Search width={20} />}
                    size="icon"
                    variant="ghost"
                    onClick={handleSearchToggle}
                />
            }
        </>
    )
}

export default SearchInput
