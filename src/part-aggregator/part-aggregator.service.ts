import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import {
  AggregatedPart,
  Packaging,
  PriceBreak,
  SupplierName,
} from './part-aggregator.modal';

@Injectable()
export class PartAggregatorService {
  async aggregatePartData(partNumber: string): Promise<AggregatedPart> {
    try {
      // Fetch data from supplier APIs
      const [myArrowResponse, ttiResponse] = await Promise.all([
        axios.get(
          'https://backend-takehome.s3.us-east-1.amazonaws.com/myarrow.json',
        ),
        axios.get(
          'https://backend-takehome.s3.us-east-1.amazonaws.com/tti.json',
        ),
      ]);

      // Check if both API calls were successful
      if (myArrowResponse.status !== 200 || ttiResponse.status !== 200) {
        throw new Error('One or more API calls failed.');
      }

      // Extract data from the Axios response objects
      const myArrowData = myArrowResponse.data;
      const ttiData = ttiResponse.data;

      return this.processAggregatePartData(ttiData, myArrowData, partNumber);
    } catch (error) {
      // Handle errors here
      console.error('Error fetching data:', error.message);
      throw error;
    }
  }

  private processAggregatePartData(
    ttiData: any,
    myArrowData: any,
    partNumber: string,
  ): AggregatedPart {
    // Extract required data from the supplier responses
    const ttiPart = ttiData.parts.find(
      (part) => part.ttiPartNumber === partNumber,
    );
    const myArrowPart = myArrowData.pricingResponse.find(
      (part) => part.partNumber === partNumber,
    );

    // Check if it exists
    if (!myArrowPart && !ttiPart) {
      return null;
    }

    // Create the AggregatedPart object
    const aggregatedPart: AggregatedPart = {
      name: ttiPart?.description || myArrowPart?.description || '',
      description: ttiPart?.description || myArrowPart?.description || '',
      totalStock: Number(ttiPart?.availableToSell) || 0,
      manufacturerLeadTime: Number(ttiPart?.leadTime.supplierLeadTime) || 0,
      manufacturerName:
        ttiPart?.manufacturer || myArrowPart?.manufacturer || '',
      packaging: this.createPackaging(myArrowPart),
      productDoc:
        ttiPart?.datasheetURL ||
        myArrowPart?.urlData.find((data) => data.type === 'Datasheet')?.value ||
        '',
      productUrl:
        myArrowPart?.urlData.find((data) => data.type === 'Part Details')
          ?.value || '',
      productImageUrl:
        myArrowPart?.urlData.find((data) => data.type === 'Image Large')
          ?.value || '',
      specifications: {},
      sourceParts: [SupplierName.TTI, SupplierName.ARROW],
    };

    return aggregatedPart;
  }

  private createPackaging(myArrowPart: any): Packaging[] {
    const packaging: Packaging[] = [];

    if (myArrowPart) {
      packaging.push({
        type: myArrowPart.pkg,
        minimumOrderQuantity: Number(myArrowPart.minOrderQuantity),
        quantityAvailable: Number(myArrowPart.fohQuantity),
        unitPrice: Number(myArrowPart.resalePrice),
        supplier: SupplierName.ARROW,
        priceBreaks: this.createPriceBreaks(myArrowPart.pricingTier),
        manufacturerLeadTime: myArrowPart?.leadTime.supplierLeadTimeDate || '',
      });
    }

    return packaging;
  }

  private createPriceBreaks(pricingTier: any[]): PriceBreak[] {
    return pricingTier.map((tier) => ({
      breakQuantity: Number(tier.minQuantity),
      unitPrice: Number(tier.resalePrice),
      totalPrice: Number(tier.minQuantity) * Number(tier.resalePrice),
    }));
  }
}
