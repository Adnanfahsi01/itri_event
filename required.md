# System Requirements - AI ITRI NTIC EVENT 2026

## Minimum System Requirements

### Server Environment

#### Operating System
- **Windows**: Windows 10/11, Windows Server 2019+
- **macOS**: macOS 10.15 (Catalina) or later
- **Linux**: Ubuntu 20.04 LTS, CentOS 8+, Debian 10+

#### Hardware Requirements
- **CPU**: 2+ cores, 2.0 GHz minimum
- **RAM**: 4GB minimum (8GB recommended)
- **Storage**: 2GB free disk space minimum
- **Network**: Stable internet connection for dependencies

## Development Environment

### Required Software

#### Backend Requirements (Laravel)
- **PHP**: 8.1 or higher ⚠️ Critical
  - Extensions required:
    - BCMath PHP Extension
    - Ctype PHP Extension
    - cURL PHP Extension
    - DOM PHP Extension
    - Fileinfo PHP Extension
    - JSON PHP Extension
    - Mbstring PHP Extension
    - OpenSSL PHP Extension
    - PCRE PHP Extension
    - PDO PHP Extension
    - Tokenizer PHP Extension
    - XML PHP Extension

- **Composer**: 2.0+ (PHP dependency manager)
- **Web Server**: Apache 2.4+ or Nginx 1.18+

#### Database
- **MySQL**: 8.0 or higher (recommended)
- **MariaDB**: 10.3+ (alternative)
- **PostgreSQL**: 13+ (alternative)

#### Frontend Requirements (React)
- **Node.js**: 16.0 or higher ⚠️ Critical
- **npm**: 8.0+ or **Yarn**: 1.22+

### Development Tools

#### Essential
- **Git**: 2.30+ for version control
- **Code Editor**: VS Code, PHPStorm, or similar
- **Terminal/Command Line**: PowerShell, Bash, or similar

#### Optional but Recommended
- **Postman/Insomnia**: API testing
- **MySQL Workbench**: Database management
- **Browser**: Chrome/Firefox (for development tools)

## Production Environment

### Server Specifications

#### Minimum Production Server
- **CPU**: 4 cores, 2.4 GHz
- **RAM**: 8GB (16GB recommended)
- **Storage**: 50GB SSD
- **Bandwidth**: 100 Mbps

#### Recommended Production Server
- **CPU**: 8 cores, 3.0 GHz
- **RAM**: 16GB+
- **Storage**: 100GB+ SSD
- **Bandwidth**: 1 Gbps
- **Load Balancer**: For high traffic

### Production Software Stack

#### Web Server
- **Nginx**: 1.20+ (recommended)
- **Apache**: 2.4+ (alternative)
- **SSL Certificate**: Required for HTTPS (QR scanning needs HTTPS)

#### Database (Production)
- **MySQL**: 8.0+ with optimized configuration
- **Connection Pooling**: Recommended for high traffic
- **Backup Solution**: Automated daily backups

#### PHP Configuration (Production)
- **PHP-FPM**: For better performance
- **OPcache**: Enabled and configured
- **Memory Limit**: 512MB minimum
- **Upload Limits**: Configured for file uploads

#### Process Management
- **Supervisor**: For queue workers
- **PM2**: For Node.js processes (if applicable)
- **Monitoring**: New Relic, DataDog, or similar

## Browser Requirements (End Users)

### Supported Browsers
- **Chrome**: 90+ (recommended for QR scanning)
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

### Mobile Browsers
- **Mobile Safari**: iOS 14+
- **Chrome Mobile**: Android 10+
- **Samsung Internet**: 14+

### Browser Features Required
- **JavaScript**: ES6+ support
- **WebRTC**: For camera access (QR scanning)
- **LocalStorage**: For session management
- **CSS Grid**: For layout support

## Network Requirements

### Bandwidth
- **Development**: 10 Mbps minimum
- **Production**: Based on concurrent users
  - 50 users: 50 Mbps
  - 200 users: 100 Mbps
  - 500+ users: 1 Gbps

### Ports
- **HTTP**: 80 (redirected to HTTPS)
- **HTTPS**: 443 (required)
- **MySQL**: 3306 (internal)
- **SSH**: 22 (administration)

### Security Requirements
- **SSL/TLS**: 1.2 minimum, 1.3 recommended
- **Firewall**: Configured for web traffic only
- **DDoS Protection**: Recommended for production

## Dependencies

### PHP Packages (Composer)
```json
{
    "laravel/framework": "^10.0",
    "laravel/sanctum": "^3.0",
    "laravel/tinker": "^2.8"
}
```

### Node.js Packages (npm)
```json
{
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "tailwindcss": "^3.2.0",
    "vite": "^4.1.0",
    "html5-qrcode": "^2.3.8"
}
```

## Installation Prerequisites

### Before Installation
1. ✅ Verify PHP version: `php --version`
2. ✅ Check PHP extensions: `php -m`
3. ✅ Verify Node.js: `node --version`
4. ✅ Check npm: `npm --version`
5. ✅ Test database connection
6. ✅ Ensure sufficient disk space
7. ✅ Check file permissions

### System Preparation
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install php8.1 php8.1-mysql php8.1-mbstring php8.1-xml php8.1-curl
sudo apt install mysql-server
sudo apt install nodejs npm

# Windows (via Chocolatey)
choco install php composer mysql nodejs

# macOS (via Homebrew)
brew install php@8.1 composer mysql node
```

## Performance Optimization

### PHP Configuration (php.ini)
```ini
memory_limit = 512M
upload_max_filesize = 10M
post_max_size = 10M
max_execution_time = 300
opcache.enable = 1
opcache.memory_consumption = 128
```

### MySQL Configuration
```ini
innodb_buffer_pool_size = 1G
max_connections = 200
query_cache_size = 64M
```

### Apache/Nginx
- **Gzip compression**: Enabled
- **Static file caching**: Configured
- **Keep-alive**: Enabled

## Security Requirements

### File Permissions
- **Application files**: 644
- **Directories**: 755
- **Storage/Bootstrap cache**: 775
- **Environment files**: 600

### Environment Variables
```env
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:your-32-character-secret-key
DB_PASSWORD=strong-database-password
```

### Security Headers
- Content Security Policy (CSP)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict-Transport-Security

## Monitoring Requirements

### Essential Monitoring
- **Uptime monitoring**: Server availability
- **Performance monitoring**: Response times
- **Error tracking**: Application errors
- **Database monitoring**: Query performance

### Logs to Monitor
- **Application logs**: Laravel logs
- **Web server logs**: Nginx/Apache access/error logs
- **Database logs**: MySQL error logs
- **System logs**: OS-level monitoring

## Backup Requirements

### What to Backup
- **Database**: Complete MySQL dumps
- **Application files**: Code and configuration
- **Uploaded files**: User-generated content
- **Environment configuration**: .env files

### Backup Schedule
- **Daily**: Database backups
- **Weekly**: Full application backup
- **Monthly**: Archive long-term storage

## Support & Updates

### Version Requirements
- **PHP**: Keep updated with security patches
- **Laravel**: Follow LTS release cycle
- **Node.js**: Use LTS versions
- **Database**: Apply security updates

### Monitoring for Updates
- Security advisories for all components
- Laravel release notes
- PHP security announcements
- Browser compatibility updates

---

**Note**: This is a comprehensive requirements list. For basic development setup, see `quick_start.md`. For detailed setup instructions, see `documentation.md`.