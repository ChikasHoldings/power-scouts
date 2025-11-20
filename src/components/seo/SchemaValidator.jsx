import { useEffect } from "react";

/**
 * Validates JSON-LD structured data for SEO
 * Shows console warnings in development mode for schema errors
 */
export default function SchemaValidator({ schemas, pageName }) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      validateSchemas(schemas, pageName);
    }
  }, [schemas, pageName]);

  return null;
}

function validateSchemas(schemas, pageName) {
  const schemaArray = Array.isArray(schemas) ? schemas : [schemas];
  
  schemaArray.forEach((schema, index) => {
    if (!schema) return;

    // Basic validation
    const errors = [];
    const warnings = [];

    // Check for required @context
    if (!schema['@context']) {
      errors.push('Missing @context property');
    } else if (schema['@context'] !== 'https://schema.org') {
      warnings.push(`@context should be "https://schema.org", got "${schema['@context']}"`);
    }

    // Check for required @type
    if (!schema['@type']) {
      errors.push('Missing @type property');
    }

    // Validate specific schema types
    switch (schema['@type']) {
      case 'Organization':
        validateOrganization(schema, errors, warnings);
        break;
      case 'BreadcrumbList':
        validateBreadcrumbList(schema, errors, warnings);
        break;
      case 'FAQPage':
        validateFAQPage(schema, errors, warnings);
        break;
      case 'Product':
        validateProduct(schema, errors, warnings);
        break;
      case 'Service':
        validateService(schema, errors, warnings);
        break;
      case 'WebPage':
        validateWebPage(schema, errors, warnings);
        break;
      case 'HowTo':
        validateHowTo(schema, errors, warnings);
        break;
      case 'LocalBusiness':
        validateLocalBusiness(schema, errors, warnings);
        break;
      case 'AggregateRating':
        validateAggregateRating(schema, errors, warnings);
        break;
      default:
        warnings.push(`Unvalidated schema type: ${schema['@type']}`);
    }

    // Log results
    if (errors.length > 0) {
      console.error(`❌ Schema validation errors in ${pageName} (schema #${index + 1}):`, errors);
    }
    if (warnings.length > 0) {
      console.warn(`⚠️ Schema validation warnings in ${pageName} (schema #${index + 1}):`, warnings);
    }
    if (errors.length === 0 && warnings.length === 0) {
      console.log(`✅ Schema valid in ${pageName} (schema #${index + 1}): ${schema['@type']}`);
    }
  });
}

function validateOrganization(schema, errors, warnings) {
  if (!schema.name) errors.push('Organization: missing required "name"');
  if (!schema.url) warnings.push('Organization: missing recommended "url"');
  if (!schema.logo) warnings.push('Organization: missing recommended "logo"');
  
  if (schema.logo && typeof schema.logo === 'string') {
    warnings.push('Organization: logo should be an ImageObject, not a string');
  }
}

function validateBreadcrumbList(schema, errors, warnings) {
  if (!schema.itemListElement || !Array.isArray(schema.itemListElement)) {
    errors.push('BreadcrumbList: missing required "itemListElement" array');
    return;
  }

  schema.itemListElement.forEach((item, i) => {
    if (!item['@type'] || item['@type'] !== 'ListItem') {
      errors.push(`BreadcrumbList item ${i}: must have @type="ListItem"`);
    }
    if (!item.position) {
      errors.push(`BreadcrumbList item ${i}: missing required "position"`);
    }
    if (!item.name) {
      errors.push(`BreadcrumbList item ${i}: missing required "name"`);
    }
  });
}

function validateFAQPage(schema, errors, warnings) {
  if (!schema.mainEntity || !Array.isArray(schema.mainEntity)) {
    errors.push('FAQPage: missing required "mainEntity" array');
    return;
  }

  schema.mainEntity.forEach((question, i) => {
    if (!question['@type'] || question['@type'] !== 'Question') {
      errors.push(`FAQPage question ${i}: must have @type="Question"`);
    }
    if (!question.name) {
      errors.push(`FAQPage question ${i}: missing required "name"`);
    }
    if (!question.acceptedAnswer) {
      errors.push(`FAQPage question ${i}: missing required "acceptedAnswer"`);
    } else {
      if (!question.acceptedAnswer['@type'] || question.acceptedAnswer['@type'] !== 'Answer') {
        errors.push(`FAQPage question ${i}: acceptedAnswer must have @type="Answer"`);
      }
      if (!question.acceptedAnswer.text) {
        errors.push(`FAQPage question ${i}: acceptedAnswer missing required "text"`);
      }
    }
  });
}

function validateProduct(schema, errors, warnings) {
  if (!schema.name) errors.push('Product: missing required "name"');
  if (!schema.offers) {
    warnings.push('Product: missing recommended "offers"');
  } else {
    if (!schema.offers.price && !schema.offers.priceSpecification) {
      warnings.push('Product: offers missing "price" or "priceSpecification"');
    }
    if (!schema.offers.priceCurrency) {
      warnings.push('Product: offers missing "priceCurrency"');
    }
  }
}

function validateService(schema, errors, warnings) {
  if (!schema.serviceType) errors.push('Service: missing required "serviceType"');
  if (!schema.provider) warnings.push('Service: missing recommended "provider"');
  if (!schema.areaServed) warnings.push('Service: missing recommended "areaServed"');
}

function validateWebPage(schema, errors, warnings) {
  if (!schema.name) errors.push('WebPage: missing required "name"');
  if (!schema.description) warnings.push('WebPage: missing recommended "description"');
  if (!schema.url) warnings.push('WebPage: missing recommended "url"');
}

function validateHowTo(schema, errors, warnings) {
  if (!schema.name) errors.push('HowTo: missing required "name"');
  if (!schema.step || !Array.isArray(schema.step)) {
    errors.push('HowTo: missing required "step" array');
  } else {
    schema.step.forEach((step, i) => {
      if (!step['@type'] || step['@type'] !== 'HowToStep') {
        errors.push(`HowTo step ${i}: must have @type="HowToStep"`);
      }
      if (!step.text && !step.name) {
        errors.push(`HowTo step ${i}: missing required "text" or "name"`);
      }
    });
  }
}

function validateLocalBusiness(schema, errors, warnings) {
  if (!schema.name) errors.push('LocalBusiness: missing required "name"');
  if (!schema.address) warnings.push('LocalBusiness: missing recommended "address"');
  if (!schema.areaServed) warnings.push('LocalBusiness: missing recommended "areaServed"');
}

function validateAggregateRating(schema, errors, warnings) {
  if (!schema.ratingValue) errors.push('AggregateRating: missing required "ratingValue"');
  if (!schema.ratingCount && !schema.reviewCount) {
    warnings.push('AggregateRating: missing recommended "ratingCount" or "reviewCount"');
  }
  if (!schema.itemReviewed) warnings.push('AggregateRating: missing recommended "itemReviewed"');
}

/**
 * Test structured data against Google's Rich Results Test
 * Returns validation URL
 */
export function getRichResultsTestUrl(url) {
  const testUrl = encodeURIComponent(url || window.location.href);
  return `https://search.google.com/test/rich-results?url=${testUrl}`;
}

/**
 * Test structured data against Schema.org validator
 * Returns validation URL
 */
export function getSchemaValidatorUrl(url) {
  const testUrl = encodeURIComponent(url || window.location.href);
  return `https://validator.schema.org/#url=${testUrl}`;
}