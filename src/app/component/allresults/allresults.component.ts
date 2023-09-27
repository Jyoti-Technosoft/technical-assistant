import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Params, Router } from '@angular/router';
import { AuthenticationService } from '@app/service/authentication.service';
import { Subscription } from 'rxjs';
import * as d3 from 'd3';
import { ResultService } from '@app/service/result.service';
import { SnackbarService } from '@app/service/snackbar.service';
import moment from 'moment';

@Component({
  selector: 'app-allresults',
  templateUrl: './allresults.component.html',
  styleUrls: ['./allresults.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AllresultsComponent implements OnInit {

  allResultData = [];
  subjectWiseData = [];
  userId: any;
  subjectType: string = 'Results';
  avatarName!: string;
  showChart = false;
  sub: Subscription;
  isMobileView = false;
  isApiCalling = true;
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
    this.userId = auth.getUserId();

    this.resultData();
    this.width = 500 - this.margin.left - this.margin.right;
    this.height = 400 - this.margin.top - this.margin.bottom;
  }

  ngOnInit(): void {

    this.auth.getScreenSize().subscribe(v => {
      this.isMobileView = v;
      this.cd?.detectChanges();
    });
  }

  resultData(): void {

    const getData = this.result.getUserResultData(this.userId).subscribe({
      next:(res) => {
        if (res.success) {
          this.allResultData = this.subjectWiseData = res.data;
          this.showChart = true;
          this.isApiCalling = false;
          if (this.allResultData.length > 0) {
            this.allResultData.forEach((data: any) => {
              const resultObject = {
                points: Number(data.points),
                type: data.quiz_id,
              };
              this.resultObject.push(resultObject);
            });
            this.createSvg();
            this.createSvg2();
            this.createTooltip();
          } else {
            this.showChart = false;
          }
          this.cd?.detectChanges();

        } else {
          this.snackBarService.error(res.message);
        }
      },
      error: (err) => {
        this.snackBarService.error(err.message);
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
    const aggregatedData = Array.from(groupedData, ([type, values]) => ({
      type,
      totalAttempts: values.length,
    }));

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
    d3.select('#bar1').classed('hide-chart', true);

    const filteredData = this.subjectWiseData.filter((d:any) => d.quiz_id === data.type);

    // Group the filtered data by date and calculate the sum of points
    const groupedData = d3.group(filteredData, (d:any) => moment(d.created_at).format("DD/MM/YYYY"));

    const aggregatedData = Array.from(groupedData, ([date, values]) => ({
      date,
      points: values.map(v => v.points)
    }));

    this.secondChart(data.type, aggregatedData);
  }

  private secondChart(type: any, data: any): void {

    this.subjectType = type;
    d3.select('#bar2').classed('hide-chart', false);
    this.svg.selectAll('*').remove();

    let allPoints:any = [];

    const transformedData = data.map((item:any) => {
      let transformedItem:any = {
        "date": item.date
      };

      item.points.sort((a:any,b:any) => a - b);

      item.points.forEach((point:any, index:number) => {
        transformedItem[`point${index + 1}`] = point;
        allPoints.push(point);
      });

      return transformedItem;
    });

    let totalKeys:any = [];

    transformedData.forEach((v:any) => {
      Object.keys(v).forEach((key:any) => {
        if ((key.toString().toLowerCase()).includes('point')) {
          totalKeys.push(key);
        }
      });
    });
    totalKeys = [...new Set(totalKeys)];

    let color = d3.scaleOrdinal()
              .domain(totalKeys)
              .range(d3.schemeCategory10);

    const stackedData = d3.stack().keys(totalKeys)(transformedData);

    const x = d3
      .scaleBand()
      .domain(transformedData.map((d:any) => d.date))
      .range([0, this.width])
      .padding(0.6);

    this.svg
      .append('text')
      .attr('x', this.width / 2)
      .attr('y', this.height + this.margin.bottom - 5)
      .attr('text-anchor', 'middle')
      .text('Date')

    let hasNegative = allPoints.some((v:any) => v < 0);
    let minValue = hasNegative ? Number(d3.min(allPoints)) - 5 : 0;

    const y = d3
      .scaleLinear()
      .domain([minValue,
              Number(d3.max(allPoints)) + 5])
      .nice()
      .range([this.height, 0]);

    this.svg.append('g').call(d3.axisLeft(y));

    if (hasNegative) {
      this.svg.append("line")
        .attr("x1", 0)
        .attr("x2", this.width - this.margin.right)
        .attr("y1", y(0))
        .attr("y2", y(0))
        .attr("stroke", "black")
        .attr("stroke-width", 1);
    }

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
      .attr("y", (d:any) => d[1] >= 0 ? y(d[1]) : y(d[0]))
      .attr("height", (d:any) => d[1] >= 0 ? y(d[0]) - y(d[1]) : y(d[1]) - y(d[0]))
      .attr("width", x.bandwidth())
      .attr('cursor', 'pointer')
      .on('click', (event: MouseEvent, d: any) => {
        this.onSecondChartBarClick(event, d);
        this.mouseleaveChart2();
        this.subjectType = 'Results';
        this.cd.detectChanges();
      })
      .on('mouseover', (event: MouseEvent, d: any) => {
        const points =  d[0] === 0 ? d[1] : d[1] - d[0];
        this.mouseoverChart2(event, points);
      })
      .on('mousemove', this.mousemoveChart2)
      .on('mouseleave', this.mouseleaveChart2)

    this.cd.detectChanges();
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
}
