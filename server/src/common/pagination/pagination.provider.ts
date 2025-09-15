import { Inject, Injectable } from '@nestjs/common';
import { PaginationDto } from '../dto';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { PaginationLinks, PaginationMetadata } from '../types';

@Injectable()
export class PaginationProvider {
  constructor(@Inject(REQUEST) private readonly req: Request) {}

  paginate<T>(dto: PaginationDto, data: T, resultCount: number) {
    const LIMIT = dto.limit as number;
    const CURRENT_PAGE = dto.page as number;
    const TOTAL_ITEMS = resultCount;
    const TOTAL_PAGES = Math.ceil(TOTAL_ITEMS / LIMIT);
    const NEXT_PAGE =
      CURRENT_PAGE === TOTAL_PAGES ? CURRENT_PAGE : CURRENT_PAGE + 1;
    const PREV_PAGE = CURRENT_PAGE === 1 ? CURRENT_PAGE : CURRENT_PAGE - 1;

    const { baseUrl, resource } = {
      baseUrl: `${this.req.protocol}://${this.req.headers.host}/`,
      resource: `${this.req.url}`,
    };

    const newUrl = new URL(resource, baseUrl);

    const meta: PaginationMetadata = {
      itemsPerPage: LIMIT,
      totalItems: TOTAL_ITEMS,
      currentPage: CURRENT_PAGE,
      totalPages: TOTAL_PAGES,
    };

    const links: PaginationLinks = {
      firstPage: `${newUrl.origin}${newUrl.pathname}?limit=${LIMIT}&page=1`,
      lastPage: `${newUrl.origin}${newUrl.pathname}?limit=${LIMIT}&page=${TOTAL_PAGES}`,
      currentPage: `${newUrl.origin}${newUrl.pathname}?limit=${LIMIT}&page=${CURRENT_PAGE}`,
      nextPage: `${newUrl.origin}${newUrl.pathname}?limit=${LIMIT}&page=${NEXT_PAGE}`,
      previousPage: `${newUrl.origin}${newUrl.pathname}?limit=${LIMIT}&page=${PREV_PAGE}`,
    };

    return { meta, links, data };
  }
}
