import { Controller, Post, UseGuards, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Storage')
@UseGuards(JwtAuthGuard)
@Controller('storage')
export class StorageController {
  @Post('upload-url')
  @ApiOperation({ summary: 'Get a signed upload URL for S3-compatible storage' })
  getUploadUrl(@CurrentUser() user: any) {
    return {
      userId: user.sub,
      method: 'PUT',
      url: 'https://storage.example.com/sakina/uploads/signed-url-placeholder',
      expiresIn: 3600,
      headers: {
        'Content-Type': 'application/octet-stream',
        'x-amz-server-side-encryption': 'AES256',
      },
      note: 'Replace with actual S3/MinIO signed URL generation',
    };
  }

  @Get('objects')
  @ApiOperation({ summary: 'List user storage objects' })
  listObjects(@CurrentUser() user: any) {
    return {
      userId: user.sub,
      objects: [],
      provider: 'S3-compatible',
      note: 'Integration with MinIO (dev) or AWS S3/Cloudflare R2 (prod)',
    };
  }
}
