import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-startquiz',
  templateUrl: './startquiz.component.html',
  styleUrls: ['./startquiz.component.scss']
})
export class StartquizComponent implements OnInit {
  @Input() instruction : string | undefined;
  @Output() startQuiz = new EventEmitter<boolean>()

  constructor(
  ) {}

  ngOnInit(): void {}

  startquiz(){
    this.startQuiz.emit(true);
  }
}
