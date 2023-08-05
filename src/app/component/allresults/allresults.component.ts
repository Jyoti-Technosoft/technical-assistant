import { Component, HostListener, OnInit } from '@angular/core';
import { Params, Router } from '@angular/router';
import { AuthenticationService } from '@app/service/authentication.service';
import {
  distinctUntilChanged,
  Observable,
  ReplaySubject,
  takeUntil
} from 'rxjs';
import { Store } from '@ngrx/store';
import { resultState } from '@app/store/result/result.state';
import { getAllResults } from '@app/store/result/result.action';
import { Result } from '@app/store/result/result.model';
import * as d3 from 'd3';

@Component({
  selector: 'app-allresults',
  templateUrl: './allresults.component.html',
  styleUrls: ['./allresults.component.scss']
})

export class AllresultsComponent implements OnInit{
  initialData: number = 12;
  allResultData: Result[] = [];
  subjectType: string = 'Results';
  loggedInUser$: Observable<any> | undefined;
  resultData$: Observable<any> | undefined;
  userData: any;
  destroyer$: ReplaySubject<boolean> = new ReplaySubject();
  avatarName!: string;
  showChart: boolean = false;

  constructor(
    public authenticationService: AuthenticationService,
    public router: Router,
    private store: Store<resultState>
  ) {
    this.width = 500 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;
  }

  @HostListener('window:resize', ['$event'])
  onresize(event?: Event): void {
    const containerWidth = document.getElementById('chart-container')?.clientWidth;
    this.width = containerWidth ? containerWidth - this.margin.left - this.margin.right: this.width;
    this.height = this.width * 0.8;
    this.drawBars(this.resultObject);
  }

  ngOnInit(): void {
    this.resultData();
    this.getUserData();
    this.createSvg();
    this.drawBars(this.resultObject);
    this.createSvg2();
    this.createTooltip();
  }

  getUserData() {
    this.loggedInUser$ = this.store.select(
      (state: any) => state.authentication
    );
    this.loggedInUser$
      .pipe(takeUntil(this.destroyer$), distinctUntilChanged())
      .subscribe((state) => {
        this.userData = state?.userData;
      });
  }

  resultData() {
    this.resultData$ = this.store.select((state: any) => state.result);
    this.resultData$
      .pipe(takeUntil(this.destroyer$), distinctUntilChanged())
      .subscribe((state) => {
        this.allResultData = state?.results;
        if (!this.allResultData) {
          this.store.dispatch(getAllResults());
        }
      });

    this.resultData$.forEach((data) => {
      this.chartArray = {};

      data.results.forEach((res: any) => {
        if (Object.keys(this.chartArray).indexOf(res.type) !== -1) {
          this.chartArray[res.type].push(res);
        } else {
          this.chartArray[res.type] = [res];
        }
      });

      if (this.allResultData.length > 0) {
        data.results.forEach((res: any) => {
          const resultObject = {
            points: res.points,
            type: res.type,
          };
          this.resultObject.push(resultObject);
        });
        this.showChart = true;  
      } else {
        this.showChart = false;    
      }
    });
  }


  loadMoreData() {
    this.initialData = this.initialData + 12;
  }

  startQuizAgain(quizName: string) {
    const queryParams: Params = { quiz: quizName };
    this.router.navigate(['/quizname'], { queryParams });
  }

  ngOnDestroy(): void {
    this.destroyer$.next(true);
    this.destroyer$.unsubscribe();
  }

  private resultObject: any[] = [];
  private chartArray: any = {};
  private tooltip: any;
  private tooltip2: any;
  private svg: any;
  private margin = { top: 20, right: 20, bottom: 50, left: 40 };
  private width!: number;
  private height!: number;

  private createTooltip(): void {
    this.tooltip = d3
      .select('body')
      .append('div')
      .style('opacity', 0)
      .attr('class', 'tooltip')
      .style('background-color', 'white')
      .style('border', 'solid')
      .style('border-width', '1px')
      .style('border-radius', '5px')
      .style('position', 'absolute')
      .style('padding', '10px');

    this.tooltip2 = d3
      .select('#bar2')
      .append('div')
      .style('opacity', 0)
      .attr('class', 'tooltip')
      .style('background-color', 'white')
      .style('border', 'solid')
      .style('border-width', '1px')
      .style('border-radius', '5px')
      .style('position', 'absolute')
      .style('padding', '10px');
  }

  private mouseoverChart1 = (points: number, type: string) => {
    this.tooltip
      .html(`Subject: ${this.capitalizeFirstLetter(type)} <br> Points: ${points}`)
      .style('opacity', 1);
  };
  private mouseoverChart2 = (
    points: number,
    correctAnswer: number,
    date: any
  ) => {
    this.tooltip2
      .html(
        `Points: ${points} <br> Correct Answer: ${correctAnswer} <br> Incorrect Answer: ${date}`
      )
      .style('opacity', 1);
  };

  private mousemoveChart1 = (event: MouseEvent) => {
    this.tooltip
      .style('left', event.pageX + 30 + 'px')
      .style('top', event.pageY + 'px');
  };
  private mousemoveChart2 = (event: MouseEvent) => {
    this.tooltip2
      .style('left', event.pageX + 30 + 'px')
      .style('top', event.pageY + 'px');
  };

  private mouseleaveChart1 = () => {
    this.tooltip.style('opacity', 0);
  };

  private mouseleaveChart2 = () => {
    this.tooltip2.style('opacity', 0);
  };

  private subjectColors = d3.scaleOrdinal<string>()
  .domain(this.resultObject.map(d => d.type))
  .range(['#0d6efd', '#3d87f7', '#72a9fc', '#a7caff']);

  private capitalizeFirstLetter (str: string)  {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private drawBars(resultObject: any[]): void {
    const colorScale = this.subjectColors;;

    const x = d3
      .scaleBand()
      .domain(resultObject.map((d) => d.type))
      .range([0, this.width])
      .padding(0.4);

    this.svg
      .append('g')
      .attr('transform', `translate(0, ${this.height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('text-anchor', 'middle')
      .text((d: any) => this.capitalizeFirstLetter(d));

    this.svg
      .append('text')
      .attr('x', this.width / 2)
      .attr('y', this.height + this.margin.bottom - 5)
      .attr('text-anchor', 'middle')
      .text('Subjects');

    const y = d3
      .scaleLinear()
      .domain([
        d3.min(resultObject, (d: any) => d.points) - 5,
        d3.max(resultObject, (d: any) => d.points) + 2,
      ])
      .range([this.height, 0]);

    this.svg.append('g').call(d3.axisLeft(y));

    this.svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -(this.height / 2))
      .attr('y', -this.margin.left + 12)
      .attr('text-anchor', 'middle')
      .text('Total Points')

    this.svg
      .selectAll('bars')
      .data(this.resultObject)
      .enter()
      .append('rect')
      .attr('x', (d: any) => x(d.type))
      .attr('y', this.height)
      .attr('width', x.bandwidth())
      .attr('height', 0)
      .attr('fill', (d: any) => colorScale(d.type))
      .on('click', (event: MouseEvent, d: any) => {
        this.onBarClick(event, d);
        this.tooltip.style('opacity', 0);
      })
      .on('mouseover', (event: MouseEvent, d: any) => {
        const points = d.points;
        const type = d.type;
        this.mouseoverChart1(points, type);
      })
      .on('mousemove', this.mousemoveChart1)
      .on('mouseleave', this.mouseleaveChart1)
      .transition()
      .duration(1000)
      .attr('y', (d: any) => y(d.points))
      .attr('height', (d: any) => this.height - y(d.points));
  }

  private createSvg(): void {
    this.svg = d3
      .select('#bar1')
      .append('svg')
      .attr('class', 'mychart')
      .attr('class', 'bar-label')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

      if(this.showChart) {
        this.drawBars(this.resultObject);
      }
  }

  private onBarClick(event: any, data: any): void {
    d3.select('#bar1').remove();
    this.drawSecondChart(data.type);
  }

  private onSubjectClick(event: any, d: any) {
    d3.select('#bar1').classed('hide-chart', false);
    this.svg.selectAll('*').remove();
    this.drawBars(this.resultObject);
  }

  private hideTooltip() {
    this.tooltip2.style('opacity', 0);
  }

  private drawSecondChart(type: any): void {
    this.subjectType = type;

    d3.select('#bar2').classed('hide-chart', false);

    const colorScale = this.subjectColors;

    this.svg.selectAll('*').remove();

    const x = d3
      .scaleBand()
      .domain(
        this.chartArray[type].map((d: any) => new Date(d.date).toLocaleString())
      )
      .range([0, this.width])
      .padding(0.4);

    this.svg
      .append('text')
      .attr('x', this.width / 2)
      .attr('y', this.height + this.margin.bottom - 5)
      .attr('text-anchor', 'middle')
      .text(this.capitalizeFirstLetter(this.chartArray[type][0].type))

    const y = d3
      .scaleLinear()
      .domain([
        d3.min(this.resultObject, (d: any) => d.points) - 5,
        d3.max(this.resultObject, (d: any) => d.points) + 2,
      ])
      .range([this.height, 0]);

    this.svg.append('g').call(d3.axisLeft(y));

    this.svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -(this.height / 2))
      .attr('y', -this.margin.left + 12)
      .attr('text-anchor', 'middle')
      .text('Total Points');

    this.svg
      .append('g')
      .attr('transform', 'translate (0, ' + this.height + ')')
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('text-anchor', 'middle');

    this.svg
      .selectAll('bars')
      .data(this.chartArray[type])
      .enter()
      .append('rect')
      .attr('x', (d: any) => x(new Date(d.date).toLocaleString()))
      .attr('y', this.height)
      .attr('width', x.bandwidth())
      .attr('height', 0)
      .attr('fill', (d: any) => colorScale(d.type))
      .on('click', (event: MouseEvent, d: any) => {
        this.onSubjectClick(event, d);
        this.hideTooltip();
        this.subjectType = 'Results';
      })
      .on('mouseover', (event: MouseEvent, d: any) => {
        const points = d.points;
        const correctAnswer = d.correctAnswer;
        const date = new Date(d.date).toLocaleDateString();
        this.mouseoverChart2(points, correctAnswer, date);
      })
      .on('mousemove', this.mousemoveChart2)
      .on('mouseleave', this.mouseleaveChart2)
      .transition()
      .duration(1000)
      .attr('y', (d: any) => y(d.points))
      .attr('height', (d: any) => this.height - y(d.points));
  }

  private createSvg2(): void {
    this.svg = d3
      .select('#bar2')
      .append('svg')
      .attr('class', 'mychart')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
  }
}
