const graphql = require('graphql');

const { GraphQLObjectType, GraphQLInputObjectType, GraphQLString, GraphQLList } = graphql;

const InfoType = new GraphQLObjectType({
  name: "Info",
  fields: () => ({
    id: { type: GraphQLString },
    userId: { type: GraphQLString },
    name: { type: GraphQLString },
    basic: { type: InfoBasicType },
    summary: { type: GraphQLList(GraphQLString) },
    education: { type: GraphQLList(InfoEducationType) },
    employment: { type: GraphQLList(InfoEmploymentType) },
    skill: { type: GraphQLList(InfoSkillType) },
    project: { type: GraphQLList(InfoProjectType) },
    award: { type: GraphQLList(InfoAwardType) },
    activity: { type: GraphQLList(InfoActivityType) },
    volunteering: { type: GraphQLList(InfoVolunteeringType) }
  })
});

// basic info type
const basicType = (name) => ({
  name: name,
  fields: () => ({
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    occupation: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
    website: { type: GraphQLString },
    location: { type: GraphQLString },
  })
});
const InfoBasicType = new GraphQLObjectType(basicType("InfoBasic"));
const InfoInputBasicType = new GraphQLInputObjectType(basicType("InfoInputBasic"));

// education info type
const educationType = (name) => ({
  name: name,
  fields: () => ({
    schoolName: { type: GraphQLString },
    duration: { type: GraphQLList(GraphQLString) },
    degree: { type: GraphQLString },
    field: { type: GraphQLString },
    note: { type: GraphQLString }
  })
});
const InfoEducationType = new GraphQLObjectType(educationType("InfoEducation"));
const InfoInputEducationType = new GraphQLInputObjectType(educationType("InfoInputEducation"));

// employment info type
const employmentType = (name, employee) => ({
  name: name,
  fields: () => ({
    employer: { type: GraphQLString },
    employee: { type: GraphQLList(employee) }
  })
});
const employeeType = (name) => ({
  name: name,
  fields: () => ({
    title: { type: GraphQLString },
    duration: { type: GraphQLList(GraphQLString) },
    description: { type: GraphQLString }
  })
});
const EmployeeType = new GraphQLObjectType(employeeType("employee"));
const InputEmployeeType = new GraphQLInputObjectType(employeeType("inputEmployee"));
const InfoEmploymentType = new GraphQLObjectType(employmentType("InfoEmployment", EmployeeType));
const InfoInputEmploymentType = new GraphQLInputObjectType(employmentType("InfoInputEmployment", InputEmployeeType));

// skill info type
const skillType = (name) => ({
  name: name,
  fields: () => ({
    group: { type: GraphQLString },
    skillNames: { type: GraphQLList(GraphQLString) }
  })
});
const InfoSkillType = new GraphQLObjectType(skillType("InfoSkill"));
const InfoInputSkillType = new GraphQLInputObjectType(skillType("InfoInputSkill"));

// project info type
const projectType= (name) => ({
  name: name,
  fields: () => ({
    name: { type: GraphQLString },
    duration: { type: GraphQLList(GraphQLString) },
    link: { type: GraphQLString },
    description: { type: GraphQLString }
  })
});
const InfoProjectType = new GraphQLObjectType(projectType("InfoProject"));
const InfoInputProjectType= new GraphQLInputObjectType(projectType("InfoInputProject"));

// award info type
const awardType= (name) => ({
  name: name,
  fields: () => ({
    name: { type: GraphQLString },
    time: { type: GraphQLString },
    awarder: { type: GraphQLString },
    description: { type: GraphQLString }
  })
});
const InfoAwardType = new GraphQLObjectType(awardType("InfoAward"));
const InfoInputAwardType= new GraphQLInputObjectType(awardType("InfoInputAward"));

// activity info type
const activityType= (name) => ({
  name: name,
  fields: () => ({
    title: { type: GraphQLString },
    duration: { type: GraphQLList(GraphQLString) },
    description: { type: GraphQLString }
  })
});
const InfoActivityType = new GraphQLObjectType(activityType("InfoActivity"));
const InfoInputActivityType= new GraphQLInputObjectType(activityType("InfoInputActivity"));

// volunteer info type
const volunteeringType= (name) => ({
  name: name,
  fields: () => ({
    title: { type: GraphQLString },
    duration: { type: GraphQLList(GraphQLString) },
    organization: { type: GraphQLString },
    location: { type: GraphQLString },
    description: { type: GraphQLString }
  })
});
const InfoVolunteeringType = new GraphQLObjectType(volunteeringType("InfoVolunteering"));
const InfoInputVolunteeringType= new GraphQLInputObjectType(volunteeringType("InfoInputVolunteering"));

module.exports = {
  InfoType,
  InfoInputBasicType,
  InfoInputEducationType,
  InfoInputEmploymentType,
  InfoInputSkillType,
  InfoInputProjectType,
  InfoInputAwardType,
  InfoInputActivityType,
  InfoInputVolunteeringType
};