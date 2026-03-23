# SCOPE.md

## In scope
- authentication with Clerk
- authenticated dashboard
- create contract draft
- edit contract draft
- seller section
- buyer section
- vehicle section
- sale terms section
- declarations section
- additional notes
- form validation
- preview page
- PDF generation
- contract history
- ownership and access control via authenticated user
- Polish UI copy only

## Out of scope
- company as seller or buyer
- co-owners
- co-buyers
- multiple vehicles in one agreement
- DOCX export
- e-signature
- OCR document scanning
- CEPiK integration
- VIN decoding APIs
- tax workflows
- post-sale checklists
- multi-language support
- organization accounts
- advanced roles and permissions

## Constraints
- keep architecture simple
- optimize for fast MVP delivery
- avoid unnecessary infrastructure
- keep rendering logic reusable between preview and PDF