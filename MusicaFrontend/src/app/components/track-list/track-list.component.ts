import { CommonModule } from "@angular/common"
import { Component,  ElementRef, ViewChild,  OnInit } from "@angular/core"
import { FormsModule } from "@angular/forms"
import  { ActivatedRoute } from "@angular/router"
import {  Observable, Subject } from "rxjs"
import { debounceTime, distinctUntilChanged } from "rxjs/operators"
import  { Store } from "@ngrx/store"


@Component({
  selector: "app-tracklist",
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: "./track-list.component.html",
  styleUrls: [],
})
export class TracklistComponent {
 
}

