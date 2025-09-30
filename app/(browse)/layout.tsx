import {Navbar} from "@/app/(browse)/_components/navbar";

const BrowseLayout = ({children}: { children: React.ReactNode }) => {
    return (
        <>
            <Navbar />
            <div className="flex h-full pt-20">
                {children}s
            </div>
        </>
    )
}

export default BrowseLayout;