import { FilterQuery, UpdateQuery } from 'mongoose';
export interface BaseInterfaceSchema<TDocument> {
  create(document: TDocument): Promise<TDocument>;
  findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument>;
  find(filterQuery: FilterQuery<TDocument>): any;
  findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument>;
}
