import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { getVariantAvailability, QueryContext } from "@medusajs/framework/utils"

export async function GET(
    req: MedusaRequest,
    res: MedusaResponse
) {
    // Get query parameters from request
    const {
        q,
        status,
        collection_id,
        category_id,
        title,
        handle,
        is_giftcard,
        type_id,
        tags,
        price_list_id,
        sales_channel_id,
        created_at,
        updated_at,
        deleted_at,
        offset = 0,
        limit = 50,
        fields,
        order,
        $and,
        $or
    } = req.query
    const query = req.scope.resolve("query")
    // Build filters object
    const filters: Record<string, any> = {
        metadata: {
            isRestocked: true
        }
    }

    const orderTransform: Record<string, any> = {}

    // Add additional filters if provided
    if (q) filters.q = q
    if (status) filters.status = status
    if (collection_id) filters.collection_id = collection_id
    if (category_id) filters.category_id = category_id
    if (title) filters.title = title
    if (handle) filters.handle = handle
    if (is_giftcard !== undefined) filters.is_giftcard = is_giftcard === 'true'
    if (type_id) filters.type_id = type_id
    if (tags) filters.tags = tags
    if (price_list_id) filters.price_list_id = price_list_id
    if (sales_channel_id) filters.sales_channel_id = sales_channel_id

    // Handle date filters
    if (created_at) filters.created_at = created_at
    if (updated_at) filters.updated_at = updated_at
    if (deleted_at) filters.deleted_at = deleted_at

    // Handle logical operators
    if ($and) filters.$and = $and
    if ($or) filters.$or = $or

    // Parse pagination parameters
    const numLimit = parseInt(limit as string) || 50
    const numOffset = parseInt(offset as string) || 0

    // Handle order parameter (sorting)
    if (order && typeof order === 'string') {
        // Check if order starts with '-' for descending order
        if (order.startsWith('-')) {
            // Remove the '-' prefix and set order to DESC
            const field = order.substring(1)
            orderTransform[field] = "DESC"
        } else {
            // No '-' prefix means ascending order
            orderTransform[order] = "ASC"
        }
    }

    // Process fields parameter
    const defaultFields = [
        "id",
        "title",
        "description",
        "handle",
        "thumbnail",
        "status",
        "categories.*",
        "variants.id",
        "variants.title",
        "variants.*",
        "variants.calculated_price.*",
        "metadata",
        "tags"
    ]

    // Parse fields if provided
    const queryFields = typeof fields === 'string'
        ? fields.split(',').map(field => {
            // Remove any + or * prefix
            if (field.startsWith('+') || field.startsWith('*')) {
                return field.substring(1)
            }
            return field
        })
        : defaultFields

    try {
        const { data: products, metadata } = await query.graph({
            entity: "product",
            fields: [
                "*",
                ...defaultFields,
            ],
            filters: {
                ...filters
            },
            pagination: {
                take: numLimit,
                skip: numOffset,
                order: Object.keys(orderTransform).length > 0 ? orderTransform : undefined
            },
            context: {
                variants: {
                    calculated_price: QueryContext({
                        region_id: req.query.region_id as string,
                        currency_code: req.query.currency_code as string,
                    }),
                },
            },
        });

        const salesChannelId = req.query.sales_channel_id as
            | string
            | string[]
        const { sales_channel_ids: idsFromPublishableKey = [] } =
            req.publishable_key_context

        let channelToUse: string | undefined
        if (salesChannelId && !Array.isArray(salesChannelId)) {
            channelToUse = salesChannelId
        }

        if (idsFromPublishableKey.length === 1) {
            channelToUse = idsFromPublishableKey[0]
        }
        // Get all variant IDs from the products
        const variantIds = products.flatMap(product =>
            product.variants?.map(variant => variant.id) || []
        );

        // Get sales channel ID from request or use a default
        // const salesChannelId = req.query.sales_channel_id || "default_channel_id";

        // Use getVariantAvailabilityStep to get inventory availability
        const variantAvailability = await getVariantAvailability(query, {
            variant_ids: variantIds,
            sales_channel_id: channelToUse || "default_channel_id"
        });

        // Update products with inventory information
        const productsWithInventory = products.map(product => {
            if (product.variants) {
                product.variants = product.variants.map(variant => {
                    if (!variant?.manage_inventory) {
                        return {
                            ...variant,
                        }
                    }
                    const availability = variantAvailability[variant.id];
                    return {
                        ...variant,
                        inventory_quantity: availability ? availability.availability : 0,
                    };
                });
            }
            return product;
        });

        res.json({
            products: productsWithInventory || [],
            count: metadata?.count || 0,
            limit: numLimit,
            offset: numOffset
        });
    } catch (error) {
        console.error("Error fetching restocked products:", error)
        res.status(400).json({
            message: "An error occurred while fetching restocked products",
            error: error.message
        })
    }
}