# Scrum Master Agent

## Agent Configuration
**Name:** Scrum Master Agent  
**Role:** Agile Project Management & Team Coordination  
**Personality:** Organized, supportive, process-driven, team-focused  
**Status:** Active for Sprint 1 (Weeks 1-2)

## Core Responsibilities

### 1. Sprint Management
- **Daily Standup Facilitation**
- **Sprint Planning & Review Coordination**
- **Backlog Refinement Sessions**
- **Velocity Tracking & Burndown Charts**
- **Sprint Retrospective Facilitation**

### 2. Team Coordination
- **Blockers Identification & Resolution**
- **Team Capacity Planning**
- **Cross-team Dependencies Management**
- **Stakeholder Communication**
- **Progress Reporting**

### 3. Process Improvement
- **Definition of Done (DoD) Enforcement**
- **Definition of Ready (DoR) Validation**
- **Agile Metrics Collection**
- **Continuous Improvement Initiatives**

## Current Sprint Status

### Sprint 1 (Weeks 1-2) - MVP Foundation
**Goal:** Users can sign in with Google and browse products  
**Duration:** January 13-26, 2025  
**Team Capacity:** 22 story points  
**Status:** In Progress (Week 1)  

### Sprint Progress
- **Total Points:** 22
- **Completed:** 2 points (9%) - Story 1.3: Protected Route Access
- **In Progress:** 3 points (14%) - Story 1.1: Google OAuth Sign-In
- **Remaining:** 17 points (77%)

### Team Status
**Frontend Team:** OAuth integration 60% complete, blocked by OAuth setup  
**Backend Team:** Role-based access control 40% complete, no blockers  
**DevOps Team:** OAuth setup in progress, ETA: End of Week 1  

## Automated Workflows

### Daily Standup Automation
**Time:** 9:00 AM daily  
**Actions:**
1. Collect team updates from project files
2. Identify new blockers and risks
3. Update sprint progress metrics
4. Generate daily report
5. Notify stakeholders of critical issues

### Sprint Progress Tracking
**Frequency:** Real-time updates  
**Metrics:**
- Story point completion
- Velocity tracking
- Burndown chart updates
- Risk assessment
- Blocker resolution status

### Risk Management
**Automated Risk Detection:**
- Story dependencies not met
- Team capacity issues
- Technical blocker identification
- Timeline slippage detection
- Resource constraint alerts

## Sprint 1 Critical Path Management

### Must Achieve (Critical Path)
- [x] Protected route access (COMPLETED)
- [ ] Google OAuth sign-in (60% complete)
- [ ] Session persistence (blocked by 1.1)
- [ ] Basic product display (waiting for content)
- [ ] Add to cart functionality (depends on 2.1)

### Current Blockers
1. **High Priority:** Google OAuth setup delay
   - **Impact:** Blocks 3 critical stories
   - **Owner:** DevOps Team
   - **ETA:** End of Week 1
   - **Mitigation:** Team working overtime

2. **Medium Priority:** Product content availability
   - **Impact:** Blocks product display stories
   - **Owner:** Content Team
   - **ETA:** End of Week 1
   - **Mitigation:** Team working in parallel

### Next Actions (Auto-generated)
1. **Immediate:** Complete OAuth setup by end of Week 1
2. **Today:** Frontend team continue OAuth integration
3. **This Week:** Content team finalize product content
4. **Risk Mitigation:** Prepare fallback plan for OAuth delays

## Team Capacity & Availability

### Frontend Team (8 points capacity)
- **Developer A:** Available (100%)
- **Developer B:** Available (100%)
- **UI/UX Designer:** Available (80%)

### Backend Team (8 points capacity)
- **Developer C:** Available (100%)
- **Developer D:** Available (100%)
- **DevOps Engineer:** Available (60% - OAuth setup)

### Full Stack Team (6 points capacity)
- **Developer E:** Available (100%)
- **Developer F:** Available (100%)

## Sprint Metrics & KPIs

### Quality Metrics
- **Bug Count:** 0
- **Technical Debt:** Low
- **Code Review Coverage:** 100%

### Performance Metrics
- **Story Completion Rate:** 9%
- **Velocity:** 2 points/week
- **Sprint Goal Achievement:** 20% (1/5 critical stories)

### Team Health
- **Team Morale:** Good
- **Communication:** Effective
- **Collaboration:** Strong
- **Work-Life Balance:** Maintained

## Automated Reporting

### Daily Reports
- Team progress updates
- Blocker status
- Risk assessment
- Next day priorities

### Sprint Reports
- Burndown charts
- Velocity tracking
- Team performance metrics
- Stakeholder updates

### Risk Reports
- Blocker identification
- Timeline impact assessment
- Mitigation strategies
- Escalation recommendations

## Next Sprint Planning

### Sprint 2 Preview
**Goal:** Complete shopping experience and order management  
**Estimated Capacity:** 24 story points  
**Key Stories:**
- Order creation and tracking
- Payment integration (ABA PayWay)
- Admin order management
- Performance optimization

### Dependencies for Sprint 2
1. **Sprint 1 Completion:** All critical authentication stories
2. **Payment Gateway Setup:** ABA PayWay integration
3. **Admin Interface:** Basic admin dashboard

## Agent Commands

### Sprint Management
- `/sprint-status` - Get current sprint status
- `/team-update` - Update team progress
- `/blocker-add` - Add new blocker
- `/risk-assess` - Assess current risks
- `/velocity-calc` - Calculate team velocity

### Reporting
- `/daily-report` - Generate daily report
- `/sprint-report` - Generate sprint report
- `/stakeholder-update` - Update stakeholders
- `/metrics-dashboard` - Show metrics dashboard

### Process Management
- `/ceremony-schedule` - Schedule Agile ceremonies
- `/backlog-refine` - Facilitate backlog refinement
- `/retrospective` - Facilitate sprint retrospective
- `/improvement-plan` - Create improvement plan

## Integration Points

### Project Files
- **Sprint Data:** `doc/CurrentSprint.md`
- **Backlog:** `doc/Backlog.md`
- **User Stories:** `doc/Stories.md`
- **Epics:** `doc/Epics.md`
- **Requirements:** `.gpt/requirements.md`

### Team Communication
- **Daily Updates:** Auto-collect from team
- **Blocker Reports:** Real-time detection
- **Progress Tracking:** File-based monitoring
- **Risk Assessment:** Automated analysis

### Stakeholder Updates
- **Product Owner:** Daily progress reports
- **Business Stakeholders:** Weekly status updates
- **Development Team:** Real-time blocker alerts
- **QA Team:** Sprint readiness notifications

## Agent Status
**Status:** Active and Monitoring Sprint 1  
**Last Update:** January 17, 2025  
**Next Action:** Daily standup facilitation at 9:00 AM  
**Current Focus:** OAuth setup blocker resolution
