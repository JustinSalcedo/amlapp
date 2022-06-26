# [AMLApp API](https://github.com/JustinSalcedo/amlapp) 🌎 → 🛒

<h4 align="center">Import products from Amazon and republish on Mercado Libre.</h4>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#user-guide">User Guide</a> •
  <a href="#try-it">Try It</a> •
  <a href="#resources">Resources</a> •
  <a href="#license">License</a>
</p>


## Features

- Publish items in bulk from Amazon to Mercado Libre Mexico.
  - (Multi-support for all countries coming soon)
- Edit items massively with custom bulk parameters.
- Auto-sync to scan and update products information.
- Customize profit margin

## User Guide

### Create your account

Post a the new user credentials to `/auth/signup`

```shell
# You can also use wget
curl -X POST https://amlapp.herokuapp.com/api/auth/signup \
  -H 'Content-Type: application/json' \
  -H 'Accept: */*'

```

> Example body parameter

```json
{
  "name": "string",
  "email": "user@example.com",
  "password": "pa$$word"
}
```

And you'll receive a 201 response like this:

```json
{
  "user": {
    "role": "string",
    "custom_parameters": {
      "profit_margin": 0,
      "is_profit_percentage": true,
      "default_quantity": 0,
      "buying_mode": "string",
      "item_condition": "string",
      "listing_type_id": "string",
      "sale_terms": [
        {
          "id": "string",
          "value_name": "string"
        }
      ],
      "local_currency_code": "string",
      "sync_concurrency_in_hours": 0
    },
    "items": [
      {}
    ],
    "_id": "string",
    "name": "string",
    "email": "string",
    "createdAt": "string",
    "updatedAt": "string",
    "__v": 0
  },
  "token": "string"
}
```

### Activate you account

#### Add your Amazon API key

AMLApp uses Axesso's Amazon web scrapper to retrieve product listings in real-time; therefore, you need a Rapidapi key to access Axesso's API. Make sure you post it to `amazon/auth/add-api-key`

```shell
curl -X POST https://amlapp.herokuapp.com/api/amazon/auth/add-api-key \
  -H 'Content-Type: application/json' \
  -H 'Accept: */*' \
  -H 'Authorization: Bearer {access-token}'

```

> Example body parameter

```json
{
  "rapidapi_key": "you_api_key_here"
}
```

If valid, you'll get:

```json
{
  "message": "Rapidapi key added"
}
```

#### Link your Mercado Libre account

Sign in to Mercado Libre using the URL AMLApp generates. Get it through `/ml/access`

```shell
curl -X GET https://amlapp.herokuapp.com/api/ml/access?origin_url=https%3A%2F%2Fapp-client.com%2Fdashbord \
  -H 'Accept: */*' \
  -H 'Authorization: Bearer {access-token}'

```

<h3 id="get-ml-access-parameters">Parameters</h3>

| Name       | In     | Type        | Required | Description                                      |
| ---------- | ------ | ----------- | -------- | ------------------------------------------------ |
| Accept     | header | string      | true     | */*                                              |
| origin_url | query  | string(uri) | true     | Redirect the user to this URL once authenticated |

> Example 200 response

```json
{
  "redirectUrl": "https://auth.mercadolibre.com.mx/authorization?response_type=code&client_id=0205730184629437&state=https://app-client.com/dashboard/b62b0016023dd8145356ebd3/295529&redirect_uri=https://amlapp.herokuapp.com/ml/auth"
}
```

Make sure to use the `redirectUrl` to start the Mercado Libre authorization flow.

## Try it

Start looking up for Amazon products by interacting with the GraphQL API at `/api/dashboard`. Use the same authorization header (`'Authorization: Bearer {access-token}'`).

> The following screenshots were taken from the GraphiQL `/api/dashboardtest`; however, this endopoint only exists for documentation purposes and doesn't accept requests.

### Search products by keyword

Browse a list of Amazon products by matching product titles and descriptions; specifying a page number allows you to browse the actual Amazon site deeper.

 ![AML - Search items by keywords](https://github.com/JustinSalcedo/amlapp-docs/raw/master/screenshots/AML%20-%20Search%20items%20by%20keywords.png)

> You can directly look up for products using a list of URLs or ASINs.

You'll get a list of items depending on the fields specified:

```json
{
    "data": {
        "amazon": {
            "searchItemsByKeyword": {
                "responseStatus": "PRODUCT_FOUND_RESPONSE",
                "foundProducts": [
                    "B097GLJ758",
                    "B0B18VM3GJ",
                    "B09TGZN1R4"
                ],
                "searchProductDetails": [
                    {
                        "asin": "B097GLJ758",
                        "productDescription": "Wallet for Men Slim Larger Capacity with 12 Slots RFID Blocking Men's Wallet Minimalist Front Pocket Bifold Leather with ID Window Gift Box",
                        "imgUrl": "https://m.media-amazon.com/images/I/71nPsTS75pL._AC_UL320_.jpg"
                    },
                    {
                        "asin": "B0B18VM3GJ",
                        "productDescription": "Airtag Wallet - DEERLET Airtag Wallet Men - Wallet for Men with AirTag Holder - Slim Minimalist RFID Blocking Wallet for Men with Money Clip - Airtag Card Holder",
                        "imgUrl": "https://m.media-amazon.com/images/I/61ct9T2TMuL._AC_UL320_.jpg"
                    },
                    {
                        "asin": "B09TGZN1R4",
                        "productDescription": "Pop Up Wallet Slim RFID Credit Card Holder Leather Wallet Up to 10 Cards Money Clip Card Case (Carbon Leather)",
                        "imgUrl": "https://m.media-amazon.com/images/I/81PVerqiy9L._AC_UL320_.jpg"
                    }
                ]
            }
        }
    }
}
```

In practice, the request will contain tens of products, which are all the listings in a single page. Save the list of ASINs for staging.

### Auto-stage items by ASIN

![AML - Autostage by ASINs](https://github.com/JustinSalcedo/amlapp-docs/raw/master/screenshots/AML%20-%20Autostage%20by%20ASINs.png)

Once staged, you'll receive a list of items like this one:

```json
[{
    "_id": "62b366463d8e29b4f63cda79",
    "published_by": "62b364963d8e29b4f63cda78",
    "allow_sync": true,
    "ml_data": {
        "description": {
            "plain_text": "El computadora port til MacBook Air de 11.6\" (Early 2015) ultra port til de Apple es un computadora con un dise o fino y ligero. El computadora est alimentado por un procesador Dual-Core 5th-gen, Broadwell 1.6 GHz, Intel Core i5 de baja tensi n y tiene 4 GB 1600 MHz integrada de LPDDR3 RAM. Son Proporcionados por gr fica integrada intel HD Graphics 6000. El MacBook Air es alojada en una carcasa unibody de aluminio, que es tan fuerte como es la luz. Porque es corte de un bloque de aluminio s lido, la vivienda es m s fuerte que los encontrado en port tiles construido a trav s de medios tradicionales. At 11.6\" en tama o, el 16: 9 pantalla cuenta con una resoluci n nativa de 1440 x 900. Cuenta con un acabado brillante y la tecnolog a de retroiluminaci n LED para una calidad de imagen mejorada y Eficiencia energ tica."
        },
        "video_id": "YOUTUBE_ID_HERE",
        "title": "Apple MacBook Air MJVM2LL/A 11,6 pulgadas 128 GB portátil",
        "category_id": "MLM1652",
        "price": 4241,
        "currency_id": "MXN",
        "available_quantity": 0,
        "buying_mode": "buy_it_now",
        "condition": "new",
        "listing_type_id": "gold_special",
        "sale_terms": [
            {
                "id": "WARRANTY_TYPE",
                "value_name": "Garantía del vendedor"
            },
            {
                "id": "WARRANTY_TIME",
                "value_name": "90 días"
            }
        ],
        "pictures": [],
        "attributes": [
            {
                "id": "BRAND",
                "value_name": "BRAND"
            },
            {
                "id": "LINE",
                "value_name": "LINE"
            },
            {
                "id": "SSD_DATA_STORAGE_CAPACITY",
                "value_name": "SSD_DATA_STORAGE_CAPACITY"
            }
        ],
        "variations": []
    },
    "amazon_data": {
        "features": [
            "Los productos renovados se ven y funcionan como nuevos. Estos productos de segunda mano han sido inspeccionados y probados por proveedores cualificados de Amazon, que normalmente realizan una prueba de diagnóstico completa, reemplazo de cualquier pieza defectuosa y un proceso de limpieza minucioso. El embalaje y los accesorios pueden ser genéricos. Todos los productos en Amazon Renewed vienen con una garantía mínima de 90 días respaldada por el proveedor.",
            "Intel Core i5 de doble núcleo de 1,6 GHz (Turbo Boost hasta 2,7 GHz) con 3 MB de caché L3 compartido.",
            "Pantalla panorámica brillante de 11.6 pulgadas (diagonal) con retroiluminación LED, resolución de 1366 x 768.",
            "Gráficos Intel HD 6000."
        ],
        "imageUrlList": [
            "https://m.media-amazon.com/images/I/61LLziMeLlL._AC_SL1011_.jpg",
            "https://m.media-amazon.com/images/I/51mb56gZsVL._AC_SL1128_.jpg",
            "https://m.media-amazon.com/images/I/61j86UMm5ML._AC_SL1371_.jpg",
            "https://m.media-amazon.com/images/I/61RSueml14L._AC_SL1088_.jpg",
            "https://m.media-amazon.com/images/I/51W1g1rJLQL._AC_SL1092_.jpg"
        ],
        "productTitle": "Apple MacBook Air MJVM2LL/A 11,6 pulgadas 128 GB portátil (renovado)",
        "asin": "B013HD3FDK",
        "warehouseAvailability": "Solo queda(n) 1 en stock (hay más unidades en camino).",
        "price": 210,
        "productDescription": "El computadora portátil MacBook Air de 11.6\" (Early 2015) ultra portátil de Apple es un computadora con un diseño fino y ligero. El computadora está alimentado por un procesador Dual-Core 5th-gen, Broadwell 1.6 GHz, Intel Core i5 de baja tensión y tiene 4 GB 1600 MHz integrada de LPDDR3 RAM. Son Proporcionados por gráfica integrada intel HD Graphics 6000. El MacBook Air es alojada en una carcasa unibody de aluminio, que es tan fuerte como es la luz. Porque es corte de un bloque de aluminio sólido, la vivienda es más fuerte que los encontrado en portátiles construido a través de medios tradicionales. At 11.6\" en tamaño, el 16: 9 pantalla cuenta con una resolución nativa de 1440 x 900. Cuenta con un acabado brillante y la tecnología de retroiluminación LED para una calidad de imagen mejorada y Eficiencia energética.",
        "productDetails": [
            {
                "name": "Tamaño del área de visualización de la pantalla con pie",
                "value": "11.6 Pulgadas"
            },
            {
                "name": "Resolución de la pantalla",
                "value": "1366 x 768 pixels"
            },
            {
                "name": "Máxima resolución de pantalla",
                "value": "1440 x 900"
            },
            {
                "name": "Procesador",
                "value": "1.6 GHz core_i5"
            },
            {
                "name": "RAM",
                "value": "4 GB DDR3"
            },
            {
                "name": "Velocidad de memoria",
                "value": "2.7 GHz"
            },
            {
                "name": "Disco Duro",
                "value": "128 GB"
            },
            {
                "name": "Coprocesador de gráficos",
                "value": "Intel HD Graphics 6000"
            },
            {
                "name": "Marca Chipset",
                "value": "Intel"
            },
            {
                "name": "Descripción de la tarjeta",
                "value": "Integrated"
            },
            {
                "name": "Tipo de conexión inalámbrica",
                "value": "802.11abg"
            },
            {
                "name": "Número de puertos USB 2.0",
                "value": "2"
            },
            {
                "name": "Duración de la batería media (en horas)",
                "value": "9 Horas"
            },
            {
                "name": "Brand",
                "value": "Apple"
            },
            {
                "name": "Series",
                "value": "MacBook Air"
            }
        ],
        "varations": []
    }
}]
```

### Set publishing parameters

Before publishing, ensure your products get listed with the right configuration (currency, listing type, condition). You may set a profit margin and modify the default synchronization concurrency; this last function keep your listings updated by re-scanning the Amazon products.

> If you set `is_profit_percentage: true`, your profit margin will a percentage of the item's price; else, it will be an added fixed margin in the item's currency.

![AML - Set custom params](https://github.com/JustinSalcedo/amlapp-docs/raw/master/screenshots/AML%20-%20Set%20custom%20params.png)

A confirmation response will be like this:

```json
{
    "data": {
        "stage": {
            "setCustomParameters": {
                "sync_concurrency_in_hours": 36,
                "profit_margin": 10,
                "is_profit_percentage": true,
                "listing_type_id": "gold_special",
                "local_currency_code": "MXN",
                "item_condition": "new"
            }
        }
    }
}
```

### Publish items by ID

Use the list of your staged items' IDs and publish them once you've made the right data corrections.

> If you modify an staged item's data, you may want to deactivate auto-sync to avoid AMLapp to override your changes.

![AML - Publishing items](https://github.com/JustinSalcedo/amlapp-docs/raw/master/screenshots/AML%20-%20Publishing%20items.png)

AMLApp will replay with an updated list of those staged items now published.

### See your items in Mercado Libre

Now just head up to your ML account and get ready to start selling! 😃

![AML - Publishing items](https://github.com/JustinSalcedo/amlapp-docs/raw/master/screenshots/ML%20-%20Start%20selling.png)

## Documentation

- [Authorization and User Data](https://github.com/JustinSalcedo/amlapp-docs/blob/master/Auth-and-User.md)
- [Axesso's Amazon API Setup](https://github.com/JustinSalcedo/amlapp-docs/blob/master/Amazon-Auth.md)
- [Mercado Libre Authorization Flow](https://github.com/JustinSalcedo/amlapp-docs/blob/master/ML-Auth.md)
- [GraphQL Dashboard Schemas](https://github.com/JustinSalcedo/amlapp-docs/blob/master/Dashboard-Schemas.md)

## Resources

I give credit to these technologies and providers that made this project possible:

- [Node.js](https://nodejs.org/en/) (server)
- [GraphQL](https://graphql.org/) (API query language)
- [OpenAPI](https://www.openapis.org/) (API documentation specification)
- [Postman](https://www.postman.com/) (get the exported docs [here](https://github.com/JustinSalcedo/amlapp-docs/blob/master/package-lock.json))
- [RapidAPI](https://rapidapi.com/hub) (API marketplace)
- [Axesso Amazon API](https://rapidapi.com/axesso/api/axesso-amazon-data-service1) (check the [docs](http://api-doc.axesso.de/#api-Amazon))
- [Mercado Libre API](https://developers.mercadolibre.com.co/en_us/api-docs)

## License

[MIT License](https://github.com/JustinSalcedo/amlapp/blob/master/LICENSE) - Copyright (c) 2019 Justin Salcedo
