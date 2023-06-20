import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import env from 'src/config/env';
import { JSDOM } from 'jsdom';
import { logger } from 'src/utils/service-logger';
import * as fs from 'fs';

@Injectable()
export class ScrapingService {
  constructor(private readonly httpService: HttpService) {}

  async getPrice(htmlRawData: string | null, dom_query: string) {
    // const htmlRawData = await this.getHTML(target_url, jsRendering);
    const price = this.executeQuery(htmlRawData, dom_query);
    return price;
  }

  async getStockInfo(
    htmlRawData: string | null,
    stockDomQuery: string,
    stockPattern: string | null,
  ): Promise<boolean> {
    // const htmlRawData = await this.getHTML(targetURL, jsRendering);

    // Check if the element is present using stockDomQuery

    const isInStock = this.isElementPresent(htmlRawData, stockDomQuery);

    // const isInStock = this.isDomQueryPresent(htmlRawData, stockDomQuery);

    if (!isInStock) {
      return false; // Element is not present, return false
    }

    if (isInStock && stockPattern === null) {
      return true;
    }

    // console.log("Instock Element Present", isInStock);

    const stockContent = this.getElementContent(htmlRawData, stockDomQuery);

    // console.log('Stock Content', stockContent);

    const stockStatus = this.extractPattern(stockContent);
    // console.log('Stock Status', stockStatus);
    // console.log("Stock Content full", stockStatus);

    if (stockStatus === null) {
      return false; // Element content does not match stockPattern, return false
    }
    if (typeof stockStatus === 'string' && stockStatus.trim() === stockPattern)
      return true; // Element content matches stockPattern, return true
  }

  private extractPattern(html: string | null): string | null {
    if (!html) return null;

    const hasHtmlTags = /<[a-z][\s\S]*>/i.test(html);

    if (hasHtmlTags) {
      const regex = /(?:<\/\w+>)([^<]+)/; // Matches the text after the last closing tag
      const matches = html.match(regex);

      if (matches && matches.length > 1) {
        const extractedString = matches[1].trim(); // Get the matched text and remove leading/trailing spaces
        return extractedString;
      } else {
        return null;
      }
    } else {
      return html;
    }
  }

  private isElementPresent(htmlData: string | null, domQuery: string): boolean {
    if (!htmlData) return false;

    // Create a new document
    const dom = new JSDOM(htmlData);
    // Get the document object
    const document = dom.window.document;

    const element = document.querySelector(domQuery);

    // console.log(domQuery)

    // console.log("Element", element);
    // console.log("domQuery", domQuery);

    return !!element; // Convert element to a boolean value
  }

  private getElementContent(
    htmlData: string | null,
    domQuery: string,
  ): string | null {
    if (!htmlData) return null;

    // Create a new document
    const dom = new JSDOM(htmlData);
    // Get the document object
    const document = dom.window.document;

    const element = document.querySelector(domQuery);

    if (!element) return null;

    return element.innerHTML;
  }

  async scrapeData(url: string, render: boolean): Promise<any> {
    const response = await firstValueFrom(
      this.httpService.get(`http://api.scraperapi.com`, {
        params: {
          api_key: env.scraper_api_key,
          url: url,
          render: render,
        },
      }),
    );
    if ([200, 201].indexOf(response.status) === -1) {
      return null;
    }

    const data = response.data;

    // Save the data to a text file
    // fs.writeFileSync('response.txt', data);

    return data;
  }

  private async getHTML(
    targetURL: string,
    jsRendering: boolean,
  ): Promise<string | null> {
    try {
      const url = `http://api.scraperapi.com?api_key=${env.scraper_api_key}&url=${targetURL}&render=${jsRendering}`;
      const response = await firstValueFrom(this.httpService.get(url));
      return [200, 201].indexOf(response.status) === -1 ? null : response?.data;
    } catch (error) {
      logger.error('Error in get call', error);
      return null;
    }
  }

  private executeQuery(htmlData: string, dom_query: string) {
    // Create a new document
    const dom = new JSDOM(htmlData);
    // Get the document object
    const document = dom.window.document;

    const element = document.querySelector(dom_query);

    if (!element) return null;
    const price = this.extractPrice(element.innerHTML);
    return price;
  }

  private extractPrice(html: string): number | null {
    if (!html) return null;
    const regex = /[\d,]+(?:\.\d+)?/;

    const matches = html.match(regex);
    if (matches) {
      const priceString = matches[0].replace(',', ''); // remove any commas from the matched string
      const price = parseFloat(priceString);
      if (!isNaN(price)) {
        return price;
      }
    }

    return null;
  }
}
