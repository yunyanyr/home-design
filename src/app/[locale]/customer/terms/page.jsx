import TermsHeader from "./TermsHeader";
import TermsContent from "./TermsContent";

export default function () {
    return <div className="py-10 bg-secondary min-h-screen">
        <div className="max-w-4xl mx-auto px-6">
            <TermsHeader />
            <TermsContent />
        </div>

    </div>
}