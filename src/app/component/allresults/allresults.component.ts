import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { Params, Router } from '@angular/router';
import { AuthenticationService } from '@app/service/authentication.service';
import { Subscription } from 'rxjs';
import * as d3 from 'd3';
import { ResultService } from '@app/service/result.service';
import { LOCALSTORAGE_KEY, MESSAGE } from '@app/utility/utility';
import { SnackbarService } from '@app/service/snackbar.service';

@Component({
  selector: 'app-allresults',
  templateUrl: './allresults.component.html',
  styleUrls: ['./allresults.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AllresultsComponent implements OnInit, AfterViewInit{

  allResultData = [];
  subjectWiseData = [];
  userData: any;
  subjectType: string = 'Results';
  avatarName!: string;
  showChart = false;
  sub: Subscription;
  isMobileView = false;
  resultObject: any[] = [];
  chartArray: any = {};
  tooltip: any;
  tooltip2: any;
  svg: any = '';
  margin = { top: 20, right: 20, bottom: 50, left: 40 };
  width!: number;
  height!: number;

  constructor(
    private auth: AuthenticationService,
    private result: ResultService,
    private router: Router,
    private snackBarService: SnackbarService,
    private cd: ChangeDetectorRef
  ) {

    this.sub = new Subscription();
    this.auth.authStatusListener$.next(true);
    this.userData = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY.USERDATA) as string);

    this.resultData();
    this.width = 500 - this.margin.left - this.margin.right;
    this.height = 400 - this.margin.top - this.margin.bottom;
  }

  ngOnInit(): void {

    // this.auth.getScreenSize().subscribe(v => {
    //   this.isMobileView = v;
    // });
  }

  ngAfterViewInit(): void {
    const containerWidth = document.getElementById('chart-container')?.clientWidth;
    this.width = containerWidth ? containerWidth - this.margin.left - this.margin.right: this.width;
    this.height = this.width;
    this.firstChart(this.resultObject);
    this.createSvg2();
    this.cd?.detectChanges();
  }

  resultData(): void {

    const getData = this.result.getUserResultData(this.userData.id).subscribe({
      next:(data) => {
        if (data) {
          this.allResultData = this.subjectWiseData = data;
          this.showChart = true;
          if (this.allResultData.length > 0) {
            this.allResultData.forEach((res: any) => {
              const resultObject = {
                points: res.points,
                type: res.type,
              };
              this.resultObject.push(resultObject);
            });
            this.createSvg();
            this.createSvg2();
            this.createTooltip();
            this.cd.detectChanges();
          } else {
            this.showChart = false;
          }
        } else {
          this.snackBarService.error(MESSAGE.ALL_RESULT_FAILED)
        }
      }
    });

    this.sub.add(getData);
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

      this.firstChart(this.resultObject);
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

  private firstChart(resultObject: any[]): void {

    const groupedData = d3.group(resultObject, d => d.type);
    console.log('groupedData',groupedData);
    const aggregatedData = Array.from(groupedData, ([type, values]) => ({
      type,
      totalAttempts: values.length,
    }));
    console.log('aggregatedData', aggregatedData);

    const colorScale = d3.scaleOrdinal()
                      .domain(aggregatedData.map(d => d.type))
                      .range(d3.schemeCategory10);

    const x = d3
      .scaleBand()
      .domain(resultObject.map((d) => d.type))
      .range([0, this.width])
      .padding(0.5);

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
      .text('Technologies');

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(aggregatedData, (d:any) => d.totalAttempts) + 2])
      .range([this.height, 0]);

    this.svg.append('g').call(d3.axisLeft(y));

    this.svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -(this.height / 2))
      .attr('y', -this.margin.left + 12)
      .attr('text-anchor', 'middle')
      .text('Attempts')

    this.svg
      .selectAll('bars')
      .data(aggregatedData)
      .enter()
      .append('rect')
      .attr('x', (d:any) => x(d.type))
      .attr('y', (d:any) => y(d.totalAttempts))
      .attr('width', x.bandwidth())
      .attr('height', (d:any) => this.height - y(d.totalAttempts))
      .attr('cursor', 'pointer')
      .style("fill", (d:any) => colorScale(d.type))
      .on('click', (event: MouseEvent, d: any) => {
        this.onFirstChartBarClick(event, d);
        this.tooltip.style('opacity', 0);
      })
      .on('mouseover', (event: MouseEvent, d: any) => {
        const points = d.totalAttempts;
        this.mouseoverChart1(event, points);
      })
      .on('mousemove', this.mousemoveChart1)
      .on('mouseleave', this.mouseleaveChart1)
      .transition()
      .duration(1000)
  }

  private onFirstChartBarClick(event: any, data: any): void {

    d3.select('#bar1').remove();
    const filteredData = this.subjectWiseData.filter((d:any) => d.type === data.type);

  // Group the filtered data by date and calculate the sum of points
    const groupedData = d3.group(filteredData, (d:any) => d.date);
    const aggregatedData = Array.from(groupedData, ([date, values]) => ({
      date,
      points: values.map(v => v.points)
    }));

    this.secondChart(data.type, aggregatedData);
  }

  private secondChart(type: any, data: any): void {

    console.log('data======', data);

    this.subjectType = type;
    d3.select('#bar2').classed('hide-chart', false);
    this.svg.selectAll('*').remove();

    let allPoints:any = [];

    const transformedData = data.map((item:any) => {
      let transformedItem:any = {
        "date": item.date
      };

      item.points.forEach((point:any, index:number) => {
        transformedItem[`point${index + 1}`] = point;
        allPoints.push(point);
      });

      return transformedItem;
    });

    console.log('transformedData', transformedData, allPoints);

    let totalKeys:any = [];

    transformedData.forEach((v:any) => {
      Object.keys(v).forEach((key:any) => {
        if ((key.toString().toLowerCase()).includes('point')) {
          totalKeys.push(key);
        }
      });
    });
    totalKeys = [...new Set(totalKeys)];
    console.log('totalKeys', totalKeys);

    let color = d3.scaleOrdinal()
              .domain(totalKeys)
              .range(d3.schemeCategory10);

    const stackedData = d3.stack().keys(totalKeys)(transformedData);

    console.log('stackedData********', stackedData);

    const x = d3
      .scaleBand()
      .domain(transformedData.map((d:any) => d.date))
      .range([0, this.width])
      .padding(0.4);

    this.svg
      .append('text')
      .attr('x', this.width / 2)
      .attr('y', this.height + this.margin.bottom - 5)
      .attr('text-anchor', 'middle')
      .text('Date')

    const y = d3
      .scaleLinear()
      .domain([Number(d3.min(allPoints)) - 3,
              Number(d3.max(allPoints)) + 3])
      .nice()
      .range([this.height, 0]);

    this.svg.append('g').call(d3.axisLeft(y));

    // let color = ['#00D7D2', '#313c53', '#7BD500', '#e41a1c', '#377eb8', '#4daf4a']

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
      .append("g")
      .selectAll('g')

      .data(stackedData)
      .join('g')
      .attr('fill', (d:any) => color(d.key))
      .selectAll("rect")

      .data((d:any) => d)
      .join("rect")
      .attr("x", (d:any)=> x(d.data.date))
      // .attr("y", (d:any)=> Number(y(d[1])))
      // .attr('height', (d:any) => y(d[0]) - y(d[1]))
      .attr("y", (d:any) => d[1] > 0 ? y(d[1]) : y(d[0]))
      .attr("height", (d:any) => d[1] > 0 ? y(d[0]) - y(d[1]) : y(d[1]) - y(d[0]))
      .attr("width", x.bandwidth())
      .attr('cursor', 'pointer')
      .on('click', (event: MouseEvent, d: any) => {
        this.onSecondChartBarClick(event, d);
        this.mouseleaveChart2();
        this.subjectType = 'Results';
      })
      .on('mouseover', (event: MouseEvent, d: any) => {
        const points = d[1];
        this.mouseoverChart2(event, points);
      })
      .on('mousemove', this.mousemoveChart2)
      .on('mouseleave', this.mouseleaveChart2)
  }

  private onSecondChartBarClick(event: any, d: any) {
    d3.select('#bar1').classed('hide-chart', false);
    this.svg.selectAll('*').remove();
    this.firstChart(this.resultObject);
  }

  // tooltip section

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
  }

  private mouseoverChart1 = (e:any, points: number) => {

    this.tooltip
    // total attempts number
      .html(`<b> Total - ${points} </b>`)
      .style('opacity', 1)
      .style("top", (e.pageY-20)+"px").style("left",(e.pageX+20)+"px");
  };

  private mousemoveChart1 = (event: MouseEvent) => {

    this.tooltip
      .style('left', event.pageX + 10 + 'px')
      .style('top', event.pageY + 'px');
  };

  private mouseleaveChart1 = () => {

    this.tooltip.style('opacity', 0);
  };

  private mouseoverChart2 = (e: any, points: number) => {
    this.tooltip
      .html(`Points: ${points}`)
      .style('opacity', 1)
      .style("top", (e.pageY-20)+"px").style("left",(e.pageX+20)+"px");
  };

  private mousemoveChart2 = (event: MouseEvent) => {

    this.tooltip
      .style('left', event.pageX + 10 + 'px')
      .style('top', event.pageY + 'px');
  };

  private mouseleaveChart2 = () => {

    this.tooltip.style('opacity', 0);
  };

  private capitalizeFirstLetter (str: string)  {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  startQuizAgain(quizName: string): void {

    const queryParams: Params = { quiz: quizName };
    this.router.navigate(['/quizname'], { queryParams });
  }

  ngOnDestroy(): void {

    this.sub.unsubscribe();
  }

  // private subjectColors = d3.scaleOrdinal<string>()
  // .domain(this.resultObject.map(d => d.type))
  // .range(['#6a9cd2', '#3d87f7', '#72a9fc', '#a7caff']);
}
