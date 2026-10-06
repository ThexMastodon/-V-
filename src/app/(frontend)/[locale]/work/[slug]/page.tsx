import { detailRoute } from '@/components/detail/detailRoute'

const route = detailRoute('work')

export const generateStaticParams = route.generateStaticParams
export const generateMetadata = route.generateMetadata
export default route.Page
