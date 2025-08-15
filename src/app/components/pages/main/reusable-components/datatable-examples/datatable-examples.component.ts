import { ChangeDetectorRef, ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '../../../../shared/common/datatable/datatable.component';
import { DatatableConfig, DatatableEvent } from '../../../../../core/models/datatable.models';
import { PostService } from '../../../../../core/services/post.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ALERT_TYPE } from '../../../../../core/constants/constants';
import { PostModel } from '../../../../../core/models/post.models';
import { ApiResponse } from '../../../../../core/models/models';
import { POST_COLUMNS } from '../../../../../core/constants/table-columns.constants';

@Component({
  selector: 'app-datatable-examples',
  standalone: true,
  imports: [CommonModule, NgbNavModule, DatatableComponent],
  templateUrl: './datatable-examples.component.html',
  styleUrls: ['./datatable-examples.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatatableExamplesComponent {
  constructor(
    private postService: PostService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  protected posts: PostModel[] = [];
  protected sortedPosts: PostModel[] = [];
  protected activeTab = 1;
  protected loading = false;

  // Basic datatable configuration
  protected basicConfig: DatatableConfig<PostModel> = {
    title: 'Basic Datatable with Continuous Data',
    columns: POST_COLUMNS,
    data: [
      {
        id: 1,
        userId: 101,
        title: 'Getting Started with TypeScript',
        body: 'A comprehensive guide to TypeScript basics',
        tags: ['typescript', 'programming'],
        views: 1500,
        reactions: { likes: 230, dislikes: 5 },
      },
      {
        id: 2,
        userId: 102,
        title: 'Angular Best Practices',
        body: 'Learn the best practices for Angular development',
        tags: ['angular', 'frontend'],
        views: 2300,
        reactions: { likes: 180, dislikes: 1 },
      },
      {
        id: 3,
        userId: 103,
        title: 'React vs Angular',
        body: 'Comparing two popular frontend frameworks',
        tags: ['react', 'angular', 'comparison'],
        views: 3200,
        reactions: { likes: 420, dislikes: 15 },
      },
      {
        id: 4,
        userId: 104,
        title: 'JavaScript Tips and Tricks',
        body: 'Useful JavaScript shortcuts and techniques',
        tags: ['javascript', 'tips'],
        views: 1800,
        reactions: { likes: 150, dislikes: 0 },
      },
      {
        id: 5,
        userId: 105,
        title: 'Web Performance Optimization',
        body: 'Guide to improving website performance',
        tags: ['performance', 'web'],
        views: 2100,
        reactions: { likes: 190, dislikes: 0 },
      },
      {
        id: 6,
        userId: 106,
        title: 'CSS Grid Layout Tutorial',
        body: 'Master CSS Grid layout system',
        tags: ['css', 'layout'],
        views: 1600,
        reactions: { likes: 280, dislikes: 2 },
      },
      {
        id: 7,
        userId: 107,
        title: 'Node.js Fundamentals',
        body: 'Understanding Node.js core concepts',
        tags: ['nodejs', 'backend'],
        views: 2800,
        reactions: { likes: 310, dislikes: 7 },
      },
      {
        id: 8,
        userId: 108,
        title: 'RESTful API Design',
        body: 'Best practices for designing REST APIs',
        tags: ['api', 'rest'],
        views: 2500,
        reactions: { likes: 265, dislikes: 51 },
      },
      {
        id: 9,
        userId: 109,
        title: 'Docker for Beginners',
        body: 'Getting started with Docker containerization',
        tags: ['docker', 'devops'],
        views: 1900,
        reactions: { likes: 175, dislikes: 7 },
      },
      {
        id: 10,
        userId: 110,
        title: 'Git Version Control',
        body: 'Essential Git commands and workflows',
        tags: ['git', 'version-control'],
        views: 2700,
        reactions: { likes: 320, dislikes: 1 },
      },
    ],
    showSearch: true,
    enableFiltering: true,
    pageSize: 5,
    persistState: true,
    stateKey: 'basic-datatable',
  };

  protected basicTableWithExportConfig: DatatableConfig<PostModel> = {
    title: 'Posts Table with Export',
    columns: POST_COLUMNS,
    showSearch: true,
    enableFiltering: true,
    enableSorting: true,
    selectionMode: 'multi',
    export: {
      enabled: true,
      formats: ['csv', 'excel', 'pdf'],
    },
  };

  // Datatable with buttons configuration
  protected buttonsConfig: DatatableConfig<PostModel> = {
    title: 'Posts Datatable with Buttons',
    columns: [
      ...POST_COLUMNS,
      {
        prop: 'actions',
        name: 'Actions',
        type: 'action',
        isToggleable: false,
        actions: [
          {
            icon: 'bi-pencil',
            text: 'Edit',
            onClick: (row: PostModel) => this.onEdit(row),
            class: 'btn btn-sm btn-outline-primary me-2',
            type: 'button',
          },
          {
            icon: 'bi-trash',
            text: 'Delete',
            onClick: (row: PostModel) => this.onDelete(row),
            class: 'btn btn-sm btn-outline-danger',
            type: 'button',
          },
        ],
      },
    ],
    showSearch: true,
    enableFiltering: true,
    selectionMode: 'multi',
    pageSize: 10,
    stateKey: 'buttons-datatable',
  };

  // Multiple datatables in tabs configuration
  protected tabsConfig: { [key: string]: DatatableConfig<PostModel> } = {
    popular: {
      title: 'Popular Posts',
      columns: POST_COLUMNS,
      showSearch: true,
      enableFiltering: true,
      pageSize: 10,
      virtualScroll: true,
      persistState: true,
      stateKey: 'popular-posts-datatable',
    },
    recent: {
      title: 'Recent Posts',
      columns: POST_COLUMNS,
      showSearch: true,
      enableFiltering: true,
      pageSize: 5,
      virtualScroll: true,
      persistState: true,
      stateKey: 'recent-posts-datatable',
    },
  };

  ngOnInit(): void {
    this.refreshData();
    this.continuouslyAddBasicDatatableData();
  }

  private continuouslyAddBasicDatatableData(): void {
    setInterval(() => {
      this.addBasicDatatableData();
    }, 3000);
  }

  private addBasicDatatableData(): void {
    const newRow: PostModel = {
      id: this.basicConfig.data!.length + 1,
      userId: this.basicConfig.data!.length + 1,
      title: `New Post ${this.basicConfig.data!.length + 1}`,
      body: 'Lorem ipsum dolor sit amet.',
      tags: ['typescript', 'programming'],
      views: 1500,
      reactions: { likes: 230, dislikes: 5 },
    };
    this.basicConfig = {
      ...this.basicConfig,
      data: [...(this.basicConfig.data ?? []), newRow],
    };
    this.cdr.markForCheck();
  }

  private updateAllConfigs(): void {
    this.sortedPosts = [...this.posts].sort((a, b) => b.views - a.views);
    this.cdr.markForCheck();
  }

  private loadPosts(): Promise<void> {
    return new Promise((resolve) => {
      this.postService.getAll().subscribe({
        next: (response: ApiResponse<PostModel[]>) => {
          this.posts = response['posts'] || [];
          console.table(this.posts);
          resolve();
        },
        error: (error: HttpErrorResponse) => {
          this.toastService.showError(error.message || 'Failed to load posts.');
          resolve();
        },
      });
    });
  }

  protected refreshData(): void {
    this.loading = true;
    this.cdr.markForCheck();
    this.loadPosts().then(() => {
      this.updateAllConfigs();
      this.loading = false;
      this.cdr.markForCheck();
    });
  }

  protected onDatatableEvent(event: DatatableEvent): void {
    this.handleDatatableEvent(event);
    this.cdr.markForCheck();
  }

  private handleDatatableEvent(event: DatatableEvent): void {
    switch (event.type) {
      case 'filter':
        console.log('Filter applied:', event.meta);
        break;
      case 'sort':
        console.log('Sort applied:', event.meta);
        break;
      case 'page':
        console.log('Page changed:', event.meta);
        break;
      case 'select':
        console.log('Selected rows:', event.data);
        break;
      case 'export':
        this.handleExport(event.data, event.meta?.format);
        break;
    }
  }

  private onEdit(post: PostModel): void {
    console.log('Edit post:', post);
    // Here you would typically open a modal or navigate to edit form
  }

  private onDelete(post: PostModel): void {
    if (confirm(`Are you sure you want to delete "${post.title}"?`)) {
      console.log('Delete post:', post);
      // Here you would typically make an API call to delete the post
    }
  }

  private handleExport(data: any[], format: 'csv' | 'excel' | 'pdf'): void {
    console.log(`Exporting data in ${format} format`, data);
    // Here you would implement the export logic for each format
  }
}
