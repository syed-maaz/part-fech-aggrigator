# Part Aggregator API

The Part Aggregator API is a RESTful API that aggregates data from two different suppliers, TTI and Arrow, for a specific electronic component part number. The API combines information about the part's stock availability, pricing, manufacturer details, packaging, and more from both suppliers.

## Endpoints

### Get Aggregated Part Data

Retrieves aggregated data for a specific part number from both TTI and Arrow suppliers.

**Endpoint:** `GET /parts`

**Query Parameter:**

- `part`: The part number to fetch aggregated data for. (e.g., `part=0510210200`)

**Response:**

If the specified part number is found in both TTI and Arrow data, the API will return an aggregated response containing information from both suppliers. The response will be in JSON format and will include details such as part name, description, total stock, pricing details, manufacturer lead time, packaging, product documents, URLs, and source parts.

If the part number is not found in either TTI or Arrow data, the API will return a 404 Not Found response with an appropriate error message.

## How to Use

1. Clone the repository:

```bash
git clone <repository-url>
cd part-aggregator-api
```

2. Install dependencies:

```bash
npm install
```

3. Run the server:

```bash
npm start
```

The API server will start running on `http://localhost:3000`.

## Example Request

To get aggregated data for part number `0510210200`, make a GET request to:

```
GET http://localhost:3000/parts?part=0510210200
```

## Example Response

```json
{
  "data": {
    "name": "Headers & Wire Housings 1.25MM REC 02P FEMALE",
    "description": "Headers & Wire Housings 1.25MM REC 02P FEMALE",
    "totalStock": 226274,
    "manufacturerLeadTime": 0,
    "manufacturerName": "Molex",
    "packaging": [
      {
        "type": "EACH",
        "minimumOrderQuantity": 1,
        "quantityAvailable": 0,
        "unitPrice": 0.0545,
        "supplier": "ARROW",
        "priceBreaks": [
          {"breakQuantity": 1, "unitPrice": 0.0773, "totalPrice": 0.0773},
          {"breakQuantity": 857, "unitPrice": 0.0725, "totalPrice": 62.1325},
          {"breakQuantity": 4468, "unitPrice": 0.0651, "totalPrice": 290.8668},
          {"breakQuantity": 15221, "unitPrice": 0.0545, "totalPrice": 829.5445}
        ],
        "manufacturerLeadTime": "30-May-2023"
      }
    ],
    "productDoc": "https://www.molex.com/pdm_docs/sd/510210200_sd.pdf",
    "productUrl": "https://my.arrow.com/products/2384_06516206",
    "productImageUrl": "https://download.siliconexpert.com/pdfs/2017/4/13/14/43/19/291/mol_/manual/51021_iso.jpg",
    "specifications": {},
    "sourceParts": ["TTI", "ARROW"]
  },
  "error": null
}
```

## Error Handling

If an invalid or non-existent part number is provided in the request, the API will respond with a 404 Not Found status code and an error message indicating that the part number is not supported.

## Technology Stack

- Node.js
- NestJS (a progressive Node.js framework)
