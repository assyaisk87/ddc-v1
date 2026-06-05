import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  PROJECTS_DATA,
  PROJECT_CATEGORIES,
  Project
} from '../../data/projects.data';
import { SeoService } from '../../services/seo.service';


@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './projects.html',
  styleUrl: './projects.scss'
})

export class Projects implements OnInit, OnDestroy {
  @ViewChild('projectsChart') projectsChartRef!: ElementRef;
  @ViewChild('techChart') techChartRef!: ElementRef;
  @ViewChild('performanceChart') performanceChartRef!: ElementRef;


  // Chart.js instances
  projectsChart: any = null;
  techChart: any = null;
  performanceChart: any = null;
  isChartsLoading = true;


  projects = PROJECTS_DATA;
  categories = PROJECT_CATEGORIES; 
  selectedCategory: string = 'All';
  selectedProject: Project | null = null;

  constructor(private seo: SeoService) {}

  ngOnInit() {
     this.seo.updateSeo({
      title: 'Проекты DDC | Центр цифрового развития',
      description: 'Интерактивная аналитика, цифровые проекты, технологии и решения Центра цифрового развития.',
      image: '/assets/og/projects-og.webp',
      url: 'https://твой-сайт.netlify.app/projects'
    });
  }

  async ngAfterViewInit() {
    await this.loadCharts();
  }

  ngOnDestroy() {
    // Destroy charts on component destroy
    if (this.projectsChart) this.projectsChart.destroy();
    if (this.techChart) this.techChart.destroy();
    if (this.performanceChart) this.performanceChart.destroy();
  }
  
  openProject(project: Project) {
    this.selectedProject = project;
  }

  closeProject() {
    this.selectedProject = null;
  }

  private async loadCharts() {
    this.isChartsLoading = true;

    const ChartJS = await import('chart.js');

    ChartJS.Chart.register(...ChartJS.registerables);

    await new Promise(resolve => setTimeout(resolve, 600));

    this.initCharts(ChartJS.Chart);

    this.isChartsLoading = false;
  }

  filterProjects(category: string) {
    this.selectedCategory = category;
  }

  getFilteredProjects() {
    if (this.selectedCategory === 'All') {
      return this.projects;
    }
    return this.projects.filter(p => p.category === this.selectedCategory);
  }

  getCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
      'Payments': '#00D4FF',
      'Mobile Banking': '#7B2CBF',
      'Analytics': '#FF006E',
      'Blockchain': '#00FFA3',
      'Investment': '#FFB800',
      'E-commerce': '#FF6B9D'
    };
    return colors[category] || '#00D4FF';
  }

  initCharts(Chart: any) {
    // Projects Distribution Chart
    if (this.projectsChartRef?.nativeElement && !this.projectsChart) {
      const ctx = this.projectsChartRef.nativeElement.getContext('2d');

      // Count projects by category
      const categoryCounts: { [key: string]: number } = {};
      this.projects.forEach(p => {
        categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
      });

      this.projectsChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(categoryCounts),
          datasets: [{
            data: Object.values(categoryCounts),
            backgroundColor: [
              'rgba(0, 212, 255, 0.8)',
              'rgba(123, 44, 191, 0.8)',
              'rgba(255, 0, 110, 0.8)',
              'rgba(0, 255, 163, 0.8)',
              'rgba(255, 184, 0, 0.8)',
              'rgba(255, 107, 157, 0.8)'
            ],
            borderColor: [
              '#00D4FF',
              '#7B2CBF',
              '#FF006E',
              '#00FFA3',
              '#FFB800',
              '#FF6B9D'
            ],
            borderWidth: 2,
            hoverOffset: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '65%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#B0B0B0',
                font: {
                  size: 13
                },
                usePointStyle: true,
                padding: 20
              }
            },
            tooltip: {
              backgroundColor: 'rgba(10, 10, 15, 0.95)',
              titleColor: '#fff',
              bodyColor: '#B0B0B0',
              borderColor: 'rgba(0, 212, 255, 0.3)',
              borderWidth: 1,
              padding: 12
            }
          }
        }
      });
    }

    // Technologies Usage Chart
    if (this.techChartRef?.nativeElement && !this.techChart) {
      const ctx = this.techChartRef.nativeElement.getContext('2d');

      // Count technologies
      const techCounts: { [key: string]: number } = {};
      this.projects.forEach(p => {
        p.technologies.forEach(tech => {
          techCounts[tech] = (techCounts[tech] || 0) + 1;
        });
      });

      // Sort and take top 8
      const sortedTech = Object.entries(techCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8);

      this.techChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: sortedTech.map(([tech]) => tech),
          datasets: [{
            label: 'Использование',
            data: sortedTech.map(([, count]) => count),
            backgroundColor: 'rgba(0, 212, 255, 0.7)',
            borderColor: '#00D4FF',
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: 'rgba(10, 10, 15, 0.95)',
              titleColor: '#fff',
              bodyColor: '#B0B0B0',
              borderColor: 'rgba(0, 212, 255, 0.3)',
              borderWidth: 1,
              padding: 12
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              },
              ticks: {
                color: '#B0B0B0',
                stepSize: 1
              }
            },
            x: {
              grid: {
                display: false
              },
              ticks: {
                color: '#B0B0B0',
                font: {
                  size: 11
                }
              }
            }
          }
        }
      });
    }

    // Performance Metrics Chart
    if (this.performanceChartRef?.nativeElement && !this.performanceChart) {
      const ctx = this.performanceChartRef.nativeElement.getContext('2d');

      this.performanceChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6'],
          datasets: [{
            label: 'Производительность',
            data: [65, 78, 82, 88, 92, 95],
            borderColor: '#00D4FF',
            backgroundColor: 'rgba(0, 212, 255, 0.1)',
            tension: 0.4,
            fill: true,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBackgroundColor: '#00D4FF',
            pointBorderColor: '#fff',
            pointBorderWidth: 2
          }, {
            label: 'Надёжность',
            data: [70, 75, 80, 85, 90, 94],
            borderColor: '#7B2CBF',
            backgroundColor: 'rgba(123, 44, 191, 0.1)',
            tension: 0.4,
            fill: true,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBackgroundColor: '#7B2CBF',
            pointBorderColor: '#fff',
            pointBorderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                color: '#B0B0B0',
                font: {
                  size: 13
                },
                usePointStyle: true,
                padding: 20
              }
            },
            tooltip: {
              backgroundColor: 'rgba(10, 10, 15, 0.95)',
              titleColor: '#fff',
              bodyColor: '#B0B0B0',
              borderColor: 'rgba(0, 212, 255, 0.3)',
              borderWidth: 1,
              padding: 12
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              },
              ticks: {
                color: '#B0B0B0',
                callback: (value: string) => value + '%'
              }
            },
            x: {
              grid: {
                display: false
              },
              ticks: {
                color: '#B0B0B0'
              }
            }
          }
        }
      });
    }
  }
}
