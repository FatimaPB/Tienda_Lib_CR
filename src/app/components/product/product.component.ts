import { Component, Input } from '@angular/core';
import {Product} from './../models/product.models' 
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './product.component.html',
    styleUrl: './product.component.css'
})
export class ProductComponent {

 @Input() product!: Product;
}
