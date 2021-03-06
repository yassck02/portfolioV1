import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ExperienceService, IExperienceItem } from '../../services/experience.service';
import { Pair, SVGService } from '../../services/svg.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  templateUrl: './experience.page.html',
  styleUrls: ['./experience.page.css'],
})
export class ExperiencePage implements OnInit, AfterViewInit {

    public experiences: IExperienceItem[];

    innerHTML: SafeHtml = "";

    constructor(private experienceService: ExperienceService, 
                private svgService: SVGService,
                private sanitizer: DomSanitizer ) { }

    ngOnInit() {
        this.experienceService.getExperiences().subscribe((data) => {
            this.experiences = data
            this.renderTimeline();
        })
    }

    ngAfterViewInit() {
        this.addExperienceMouseListeners();
    }

    private start: Pair = { x: 20, y: 20 };
    private scale: Pair = { x: 15, y: 15 };
    private size:  Pair = { x: 10, y: 60 };
    private tickWidth = 0.25;

    renderTimeline() {
        this.svgService.initDocument({ x: 250, y: 1050 });
        this.drawTimeLine();
        this.drawExperiences();
        this.innerHTML = this.sanitizer.bypassSecurityTrustHtml(this.svgService.getDocument());
    }

    drawTimeLine(): void {
        this.svgService.setStroke("rgb(200,200,200)");
        this.svgService.setStroke_Width(1);

        this.svgService.line(
            this.map({ x: 0, y: 0           }), 
            this.map({ x: 0, y: this.size.y })
        )

        for(let i = 0; i <= this.size.y; i++) {
            var tickWidth = this.tickWidth;
            if (i % 12 == 0) {
                tickWidth *= 2;
            }
            this.svgService.line(
                this.map({ x: -tickWidth, y: i }),
                this.map({ x: +tickWidth, y: i }),
            )
        }
        this.svgService.clearStyles();
    }

    drawExperiences() {
        this.svgService.setStroke("rgb(200,0,0)");
        this.svgService.setStroke_Width(5);
        this.svgService.setStroke_Linecap("round");

        this.svgService.setClass("experience-item")
        for(var i = 0; i < this.experiences.length; i++) {
            this.svgService.setID(`${i}`)
            this.svgService.line(
                this.map({ x: 1.5, y: this.experiences[i].date                       }),
                this.map({ x: 1.5, y: this.experiences[i].date + this.experiences[i].duration }),
            )
        }
        this.svgService.clearStyles();
    }

    addExperienceMouseListeners() {
        var elements = Array.from(document.getElementsByClassName('experience-item'));
        console.log(elements);
        console.log(elements.length);

        elements.forEach(element => {
            element.addEventListener('mouseover', this.onMouseEnter);
            element.addEventListener('mouseout', this.onMouseLeave);
            console.log(element.id);
        });
    }

    onMouseEnter() {
        console.log("mouse entered experience event");
    }

    onMouseLeave() {
        console.log("mouse left experience event");
    }

    // Maps the given point on the timeline to a point on the canvas
    map(point: Pair): Pair {
        return { x: this.start.x + point.x * this.scale.x,
                 y: this.start.y + point.y * this.scale.y }
    }
}
