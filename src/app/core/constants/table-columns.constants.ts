import { DatatableColumn } from '../models/datatable.models';
import { PostModel } from '../models/post.models';

export const POST_COLUMNS: DatatableColumn<PostModel>[] = [
  { prop: 'title', name: 'Title', type: 'text', isToggleable: true },
  { prop: 'body', name: 'Content', type: 'text', isToggleable: true },
  {
    prop: 'tags',
    name: 'Tags',
    type: 'text',
    isToggleable: true,
    customFormat: (row: PostModel) => row.tags?.join(', ') || '-',
  },
  { prop: 'views', name: 'Views', type: 'number', isToggleable: true },
];
