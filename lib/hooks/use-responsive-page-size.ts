import { useState, useEffect } from "react"

const PAGE_SIZE_DESKTOP = 8
const PAGE_SIZE_MOBILE = 4

export function useResponsivePageSize() {
    const [pageSize, setPageSize] = useState(PAGE_SIZE_DESKTOP)

    useEffect(() => {
        function handleResize() {
            if (window.innerWidth < 768) {
                setPageSize(PAGE_SIZE_MOBILE)
            } else {
                setPageSize(PAGE_SIZE_DESKTOP)
            }
        }
        handleResize()
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    return pageSize
}
