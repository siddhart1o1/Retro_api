import json
import pymysql


def lambda_handler(event, context):
    connection = pymysql.connect(
        host="rds-mysql-tutorial.cw5il3f2mv55.ap-south-1.rds.amazonaws.com",
        user="admin",
        password="9908rajesh",
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor)

    github_id = "siddhart1o1"
    try:
        sql = """ SELECT 
                     github_data.form_data.name
                    ,github_data.form_data.age
                    ,github_data.form_data.date_of_birth
                    ,github_data.form_data.key_skills as form_data_key_skills
                    ,github_data.form_data.id  
                    ,github_data.form_data.github_profile
                    ,github_data.form_data.job_id
                    ,github_data.form_data.status
                    ,github_data.form_data.email
                    ,github_data.form_data.last_updated
                    ,github_data.form_data.experience
                    ,github_data.job_data.job_id
                    ,github_data.job_data.job_name
                    ,github_data.job_data.key_skills
                    ,github_data.job_data.status
                    ,github_data.job_data.organization
                    ,github_data.job_data.job_email
                    ,github_data.job_data.years_of_experience
                    ,github_data.job_data.description
                    ,github_data.job_data.create_date
                    ,github_data.job_data.company_logo
                    ,github_data.job_data.job_type
                    ,github_data.job_data.weekly_hours
                    ,github_data.job_data.work_hours
                    ,github_data.job_data.pay_range
                    FROM github_data.form_data
                    JOIN github_data.job_data on github_data.form_data.job_id = github_data.job_data.job_id
                    where github_profile=%s
                """
                
        
        with connection.cursor() as cursor:
            cursor.execute(sql, (github_id))
            result = cursor.fetchall()
            print(result)
        
        with connection.cursor() as cursor:
            for  i in result:
                sql = """SELECT * FROM github_data.applicant_tasks where applicant_id=%s"""
                cursor.execute(sql, (i['id']))
                result1 = cursor.fetchall()
                i['applicant_tasks'] = result1
                
                
                
                
        return {
                'statusCode': 200,
                'body': json.dumps(result,default=str)
            }
    except Exception as e:
        print(e)
        return {
            'statusCode': 500,
            'body': json.dumps('Internal Error'),
            'message': json.dumps(str(e), default=str)
        }

lambda_handler(None,None)