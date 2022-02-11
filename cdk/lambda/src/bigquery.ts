import { BigQuery } from '@google-cloud/bigquery';

interface TableInfo {
  projectId: string;
  datasetId: string;
  tableId: string;
}

export interface LogEntry {
  videoId: string;
  userId: string;
  userName: string;
  accessedAt: string;
}

export class BigQueryClient {
  private client: BigQuery;
  private projectId: string;
  private datasetId: string;
  private tableId: string;

  constructor(tableInfo: TableInfo) {
    this.client = new BigQuery();
    this.projectId = tableInfo.projectId;
    this.datasetId = tableInfo.datasetId;
    this.tableId = tableInfo.tableId;
  }

  public async log(entry: LogEntry) {
    const table = [this.projectId, this.datasetId, this.tableId].join('.');
    const query = `INSERT INTO \`${table}\` (video_id, user_id, user_name, accessed_at)
      VALUES ("${entry.videoId}", "${entry.userId}", "${entry.userName}", "${entry.accessedAt}")`;

    await this.client.createQueryJob({
      query,
      location: 'US',
    });
  }
}
