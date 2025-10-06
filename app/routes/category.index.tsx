import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "~/api/categories";
import { MainLayout } from "~/components/layout/MainLayout";

export default function CategoryIndex() {
    const { data: categories, isLoading, error } = useQuery({
        queryKey: ['categories'],
        queryFn: () => categoriesApi.getAll(),
    });
    return (
        <MainLayout>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1>Category Index</h1>
                {categories?.map((category) => (
                    <div key={category.id}>
                        <h2>{category.category}</h2>
                        <p>{category.description}</p>
                    </div>
                ))}
                {isLoading && <div>Loading...</div>}
                {error && <div>Error: {error.message}</div>}
            </div>
        </MainLayout>
    )
}

 