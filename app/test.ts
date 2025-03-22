/**
 * Updates an object value by a path string (modifies the original object)
 * @param {Object} obj - The object to update
 * @param {string} path - The path to the property (e.g., 'case.policies[0].parties[roleCode="JointOwner"].person.bodyMassIndex')
 * @param {*} value - The new value to set
 * @returns {Object} - The updated object (same as input object)
 */
function updateByPath(obj, path, value) {
    // Parse the path into segments
    const segments = parsePath(path);
    
    // Traverse and update the original object
    setValueAtPath(obj, segments, value);
    
    return obj;
  }
  
  /**
   * Parses a path string into an array of segments
   * @param {string} path - The path string
   * @returns {Array} - Array of path segments
   */
  function parsePath(path) {
    const segments = [];
    let currentProp = '';
    let inBracket = false;
    let bracketContent = '';
    
    // Parse character by character
    for (let i = 0; i < path.length; i++) {
      const char = path[i];
      
      if (char === '.' && !inBracket) {
        if (currentProp) {
          segments.push({ type: 'prop', name: currentProp });
          currentProp = '';
        }
      } 
      else if (char === '[' && !inBracket) {
        if (currentProp) {
          segments.push({ type: 'prop', name: currentProp });
          currentProp = '';
        }
        inBracket = true;
      } 
      else if (char === ']' && inBracket) {
        inBracket = false;
        
        // Handle array index
        if (/^\d+$/.test(bracketContent) || /^"?\d+"?$/.test(bracketContent)) {
          const index = parseInt(bracketContent.replace(/"/g, ''), 10);
          segments.push({ type: 'index', index });
        }
        // Handle filter like [roleCode="JointOwner"]
        else if (bracketContent.includes('=')) {
          const [key, quotedValue] = bracketContent.split('=');
          const value = quotedValue.replace(/^"(.*)"$/, '$1');
          segments.push({ type: 'filter', key, value });
        }
        
        bracketContent = '';
      } 
      else if (inBracket) {
        bracketContent += char;
      } 
      else {
        currentProp += char;
      }
    }
    
    // Add the last property if exists
    if (currentProp) {
      segments.push({ type: 'prop', name: currentProp });
    }
    
    return segments;
  }
  
  /**
   * Sets a value at the specified path in an object
   * @param {Object} obj - The object to modify directly
   * @param {Array} segments - Path segments
   * @param {*} value - Value to set
   * @param {number} index - Current segment index
   */
  function setValueAtPath(obj, segments, value, index = 0) {
    // Base case: reached the end of path
    if (index >= segments.length) return;
    
    const segment = segments[index];
    const isLast = index === segments.length - 1;
    
    // Handle property access
    if (segment.type === 'prop') {
      // Create object if it doesn't exist
      if (obj[segment.name] === undefined && !isLast) {
        obj[segment.name] = {};
      }
      
      if (isLast) {
        obj[segment.name] = value;
      } else {
        setValueAtPath(obj[segment.name], segments, value, index + 1);
      }
    }
    // Handle array index
    else if (segment.type === 'index') {
      // Create array if it doesn't exist
      if (!Array.isArray(obj)) {
        // If obj is not an array but needs to be, we need to replace it
        // This is a case where we need to modify the parent object
        // But for simplicity, we'll throw an error in this case
        throw new Error('Cannot convert non-array to array in-place');
      }
      
      // Ensure array has enough elements
      while (obj.length <= segment.index) {
        obj.push({});
      }
      
      if (isLast) {
        obj[segment.index] = value;
      } else {
        setValueAtPath(obj[segment.index], segments, value, index + 1);
      }
    }
    // Handle array filter
    else if (segment.type === 'filter') {
      // Create array if it doesn't exist
      if (!Array.isArray(obj)) {
        // Similar issue as above
        throw new Error('Cannot convert non-array to array in-place');
      }
      
      // Find element matching the filter
      let targetIndex = obj.findIndex(item => item[segment.key] === segment.value);
      
      // Create element if not found
      if (targetIndex === -1) {
        obj.push({ [segment.key]: segment.value });
        targetIndex = obj.length - 1;
      }
      
      if (isLast) {
        // If it's an object, update its properties instead of replacing it
        if (typeof value === 'object' && value !== null && !Array.isArray(value) && 
            typeof obj[targetIndex] === 'object' && obj[targetIndex] !== null) {
          Object.assign(obj[targetIndex], value);
        } else {
          // For non-objects, we need to preserve the filter key
          const filterKey = segment.key;
          const filterValue = segment.value;
          obj[targetIndex] = typeof value === 'object' && value !== null && !Array.isArray(value) 
            ? { ...value, [filterKey]: filterValue }
            : value;
          
          // Make sure the filter property is preserved
          if (obj[targetIndex][filterKey] !== filterValue) {
            obj[targetIndex][filterKey] = filterValue;
          }
        }
      } else {
        // Initialize next path component if needed
        const nextSegment = segments[index + 1];
        if (nextSegment && nextSegment.type === 'prop' && obj[targetIndex][nextSegment.name] === undefined) {
          obj[targetIndex][nextSegment.name] = {};
        }
        
        setValueAtPath(obj[targetIndex], segments, value, index + 1);
      }
    }
  }
  
  // Example usage
  const sampleObject = {
    case: {
      policies: [
        {
          parties: [
            {
              roleCode: "JointOwner",
              person: {
                bodyMassIndex: 21
              }
            }
          ]
        }
      ]
    }
  };
  
  // Example: Update the bodyMassIndex for the JointOwner
  updateByPath(
    sampleObject,
    'case.policies[0].parties[roleCode="JointOwner"].person.bodyMassIndex',
    22
  );
  
  console.log(sampleObject);