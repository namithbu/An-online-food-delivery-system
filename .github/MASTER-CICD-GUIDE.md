# Master CI/CD Pipeline Documentation

## Overview

This comprehensive **Master CI/CD Pipeline** orchestrates the complete build, test, linting, security scanning, and deployment process for the Savi Cart food delivery platform.

**File:** `.github/workflows/master-cicd-pipeline.yml`

---

## Pipeline Steps

### 1. ✅ Checkout Code
- **Action:** `actions/checkout@v3`
- **Purpose:** Clone the repository code
- **Options:**
  - `fetch-depth: 0` - Full history for better analysis
  - `submodules: 'recursive'` - Include all submodules
- **Duration:** ~30 seconds

---

### 2. ✅ Setup Node.js
- **Version:** Node 18.x
- **Action:** `actions/setup-node@v3`
- **Caching:** Enabled for all three package-lock.json files
- **Purpose:** Prepare environment for JavaScript projects
- **Duration:** ~1 minute (or cached)

---

### 3. ✅ Install Dependencies
Installs npm packages for three projects:
- **Backend:** `npm ci` (clean install)
- **Frontend:** `npm ci`
- **Admin:** `npm ci`

**Duration:** ~3-5 minutes

---

### 4. ✅ Build Projects
Production builds with optimization:

```bash
# Frontend (Vite)
npm run build
# Output: frontend/dist/

# Admin (Vite)
npm run build
# Output: admin/dist/
```

**Duration:** ~2-3 minutes

---

### 5. ✅ ESLint Linting
Runs ESLint on all JavaScript projects:

```bash
# Backend
npm run lint

# Frontend
npm run lint

# Admin
npm run lint
```

**Coverage:**
- Code style consistency
- Best practices enforcement
- Bug prevention
- Potential performance issues

**Status:** Continues on error (doesn't block pipeline)

**Duration:** ~2 minutes

---

### 6. ✅ NPM Test with Coverage
Executes test suites with coverage reporting:

```bash
# Backend Tests
npm test -- --coverage --coverageReporters=json --coverageReporters=lcov --coverageReporters=text
Env: MONGO_URI, JWT_SECRET

# Frontend Tests
npm test -- --run --coverage

# Admin Tests
npm test -- --run --coverage
```

**Duration:** ~5-10 minutes

---

### 7. ✅ Generate Coverage HTML Reports
Creates human-readable coverage reports for each project:
- `backend/coverage/index.html`
- `frontend/coverage/index.html`
- `admin/coverage/index.html`

**Purpose:** Visual representation of code coverage percentages

---

### 8. ✅ Bandit Security Scan
Python-based security analysis tool:

```bash
pip install bandit==1.7.5
bandit -r . -f json -o bandit-report.json
```

**Checks:**
- SQL injection vulnerabilities
- Hardcoded secrets
- Insecure deserialization
- Weak cryptography
- Command injection

**Output:** `bandit-report.json`

**Duration:** ~1 minute

---

### 9. ✅ Code Quality & Linting Summary
Prettier formatting validation:

```bash
npx prettier --check . --ignore-path .prettierignore
```

**Checks:**
- Code formatting consistency
- Indentation
- Line length
- Quote usage

---

### 10. ✅ Coverage Report Upload
Uploads to Codecov for tracking:
- Backend coverage (lcov.info)
- Frontend coverage (lcov.info)
- Admin coverage (lcov.info)

**Purpose:** Historical coverage tracking and PR analysis

---

### 11. ✅ Create Deployment Artifact

Creates a comprehensive deployment package with:

```
deployment-artifacts/
├── frontend-dist/          # Production frontend build
├── admin-dist/             # Production admin build
├── backend/                # Backend source code
├── .github/                # Workflows & CI/CD configs
├── reports/
│   ├── backend-coverage/   # Coverage reports
│   ├── frontend-coverage/
│   ├── admin-coverage/
│   └── bandit-report.json  # Security scan results
├── docker-compose.yml      # Docker orchestration
├── DEPLOYMENT_INFO.md      # Deployment instructions
└── README.md               # Project docs
```

**Output File:** `artifact.zip`

**Contents Include:**
- ✅ Checkout code
- ✅ Build artifacts
- ✅ Test results
- ✅ Coverage reports
- ✅ Security reports
- ✅ Docker configuration
- ✅ Deployment instructions

**Size:** ~50-100 MB (depending on builds)

**Retention:** 90 days

---

### 12. ✅ Generate CI/CD Report
Creates comprehensive markdown report documenting:
- Execution timestamp
- All completed steps
- Test summary
- Linting results
- Security scan results
- Artifacts generated
- Next deployment steps

**Output:** `CI_CD_REPORT.md`

---

### 13. ✅ Summary & Notifications
Final status report with:
- Pipeline completion status
- All step checksums
- Artifact locations
- Next steps for deployment

---

## Triggers

Pipeline automatically runs on:

```yaml
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
  workflow_dispatch:  # Manual trigger
```

**When Triggered:**
- Every push to main/develop branches
- Every pull request to main/develop
- Manual trigger via GitHub Actions UI

---

## Services

### MongoDB Service
- **Image:** mongo:5.0
- **Port:** 27017
- **Auth:** root/password
- **Health Check:** mongosh ping command
- **Purpose:** Backend testing

---

## Environment Variables

Used during testing:

```env
MONGO_URI=mongodb://root:password@localhost:27017/savi_cart_test?authSource=admin
JWT_SECRET=test-secret-key
CI=true
```

---

## Artifacts Generated

| Artifact | Location | Retention | Purpose |
|----------|----------|-----------|---------|
| coverage-reports-html | GitHub Artifacts | 30 days | Coverage visualization |
| artifact | artifact.zip | 90 days | Deployment package |
| cicd-report | CI_CD_REPORT.md | 90 days | Execution report |

**Download from:** GitHub Actions → [Workflow Run] → Artifacts

---

## Exit Criteria

Pipeline succeeds when:
- ✅ All dependencies installed
- ✅ Builds complete without errors
- ✅ ESLint passes (or continues on error)
- ✅ Tests pass with coverage metrics
- ✅ Prettier formatting valid
- ✅ Bandit security scan completes
- ✅ Deployment artifact created

**Failure Criteria:**
- ❌ Build fails
- ❌ Critical npm errors
- ❌ Test failures with exit code
- ❌ Final notification fails

---

## Time Estimates

| Step | Duration |
|------|----------|
| Checkout | ~30 sec |
| Setup Node | ~1 min (cached: ~10 sec) |
| Install Dependencies | ~3-5 min |
| Build | ~2-3 min |
| Linting | ~2 min |
| Tests | ~5-10 min |
| Coverage | ~1 min |
| Security Scan | ~1 min |
| Artifacts | ~2 min |
| **Total** | **~18-27 minutes** |

---

## Usage Examples

### View Pipeline Execution
```bash
# GitHub CLI
gh run list --workflow=master-cicd-pipeline.yml
gh run view <run-id> --log
```

### Download Artifacts
```bash
# Download deployment package
gh run download <run-id> -n artifact

# Download coverage reports
gh run download <run-id> -n coverage-reports-html
```

### Manual Trigger
```bash
# Via GitHub CLI
gh workflow run master-cicd-pipeline.yml -r main

# Via GitHub Web UI
Actions → Master CI/CD Pipeline → Run workflow
```

---

## Security Considerations

1. **Bandit Configuration:**
   - Scans entire repository
   - Skips B101 (assertion checks)
   - Generates JSON report for parsing

2. **Secret Management:**
   - Test secrets use dummy values
   - Production secrets in GitHub Secrets
   - No credentials in logs

3. **Artifact Security:**
   - Artifacts stored in GitHub (encrypted at rest)
   - Access controlled via repository permissions
   - 90-day retention then auto-delete

---

## Troubleshooting

### Pipeline Fails at Build Step
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### MongoDB Connection Error
- Verify MongoDB image: `docker inspect mongo:5.0`
- Check service health in logs
- Ensure MONGO_URI is correct

### Test Failures
- Run tests locally: `npm test`
- Check test environment variables
- Verify all dependencies installed

### Artifact Not Created
- Check disk space in runner
- Verify zip command available
- Check file paths exist

---

## Integration with GitHub

### Set Required Status Check
1. Go to **Settings → Branches → main**
2. Add **master-cicd-pipeline** as required check
3. Blocks merging if pipeline fails

### View Results
- **Actions Tab:** See all runs and logs
- **PR Comments:** Automatic status updates
- **Branch Protection:** Prevents merging failed runs

---

## Deployment Flow

```
1. Code Push to main/develop
   ↓
2. Pipeline Starts
   ├─ Checkout, Build, Test, Lint
   ├─ Security Scan
   ├─ Generate Reports
   └─ Create artifact.zip
   ↓
3. Artifacts Generated
   ├─ coverage-reports-html
   ├─ artifact (deployment package)
   └─ cicd-report
   ↓
4. Manual Deployment
   ├─ Download artifact.zip
   ├─ Extract in target environment
   └─ Run docker-compose up -d
   ↓
5. Production Running
   ├─ Frontend: http://hostname:3000
   ├─ Admin: http://hostname:3001
   └─ Backend: http://hostname:4000
```

---

## Next Steps

1. **Test Locally:** Push to feature branch, observe workflow execution
2. **Monitor:** Watch Actions tab for run details
3. **Download:** Get artifact.zip after successful run
4. **Deploy:** Follow DEPLOYMENT_INFO.md instructions
5. **Verify:** Test deployed services in target environment

---

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [ESLint Rules](https://eslint.org/docs/latest/rules/)
- [Bandit Documentation](https://bandit.readthedocs.io/)
- [Prettier Configuration](https://prettier.io/docs/en/configuration.html)
- [Jest Coverage](https://jestjs.io/docs/coverage)

---

**Created:** November 20, 2025
**Last Updated:** November 20, 2025
**Status:** Production Ready
**Maintainer:** DevOps Team
