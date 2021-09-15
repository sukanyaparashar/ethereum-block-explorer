import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {HttpService} from'./http.service';
import {Data} from './data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Ether Cash Flow Tool';

  constructor(private httpService: HttpService) { }

  gotData = false;
  data = new Data();

  copy_data(responseBody: any) {
    this.data.totalBlocksEther = responseBody.totalBlocksEther;
    this.data.toAddressHashmap = responseBody.toAddressHashmap;
    this.data.fromAddressHashmap = responseBody.fromAddressHashmap;
    this.data.toContractAddressHashmap = responseBody.toContractAddressHashmap;
    this.data.fromContractAddressHashmap = responseBody.fromContractAddressHashmap;
    this.data.totalUncles = responseBody.totalUncles;
    this.data.totalCreatedContracts = responseBody.totalCreatedContracts;
    this.data.contractTransactionCount = responseBody.contractTransactionCount;
    this.data.totalTransactionCount = responseBody.totalTransactionCount;
    this.data.contractTransactionPercentage = responseBody.contractTransactionPercentage;
    this.data.uniqueToAddressesCount = responseBody.uniqueToAddressesCount;
    this.data.uniqueFromAddressesCount = responseBody.uniqueFromAddressesCount;
    this.gotData = true;
  }

  async twoInput(fromBlock: any, toBlock: any) {
    if (fromBlock && toBlock) {
      const request = {from_block: fromBlock , to_block: toBlock};
      this.httpService.sendPostRequestTwo(JSON.stringify(request)).subscribe((responseBody) => {
        console.log(responseBody);
        this.copy_data(responseBody);
      });
    }
  }

  async singleInput(number: any) {
    if (number) {
      const request = {number: number};
      this.httpService.sendPostRequestSingle(JSON.stringify(request)).subscribe((responseBody) => {
        console.log(responseBody);
        this.copy_data(responseBody);
      });
    }
  }
}
