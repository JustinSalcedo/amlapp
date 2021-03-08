export interface IMLPredictedCategory {
    domain_id: string
    domain_name: string
    category_id: string
    category_name: string
    attributes: {
        id: string
        name: string
        value_id: string
        value_name: string
    }[]
}

// export interface IMLCategoryChildren {
//     id: string
//     name: string
//     children_categories: IMLCategoryChildren[] | null
// }