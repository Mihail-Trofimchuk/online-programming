"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
 
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import toast from "react-hot-toast";
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Wrapper } from './wrapper'
 
 
const FormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
})

type Test = {
	id: string;
	question: string;
	position: number;
  chapterId: string;
	isPublished: boolean;
	answerOptions: {
	  id: string;
	  option: string;
	  isCorrect: boolean;
	  testId: string;
	  position: number;
	}[];
  };

interface TestProps {
  tests: Test[]
	chapterId: string;
  courseId: string;
  nextChapterId?: string;
  completeOnEnd: boolean;
  isCompleted: boolean;
  };
 
export function CheckboxReactHookFormMultiple({chapterId, tests, courseId, nextChapterId, completeOnEnd, isCompleted}: TestProps ) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: [],
    },
  })


  useEffect(() => {
    const fetchUserAnswers = async () => {
      try {
        const response1 = await axios.post(`/api/userAnswers`, { chapterId });

        console.log(response1);
        const userAnswers = response1.data.answerOption.map((option: { id: any }) => option.id);
        
        form.setValue('items', userAnswers);


        const totalTests = tests.length;
        console.log(form.getValues('items'));
    
        const response = await axios.post(`/api/checkAnswer/${chapterId}`, {
          selectedAnswers: form.getValues('items'),
        });
    
        const results = response.data;
    
        const correctAnswersCount = results.reduce((count: number, result: { areAnswersCorrect: any }) => {
          if (result.areAnswersCorrect) {
            return count + 1;
          }
          return count;
        }, 0);
      
     
        const percentageCorrect = (correctAnswersCount / totalTests) * 100;
        setPercentageCorrect(percentageCorrect);
      } catch (error) {
        console.error('Error fetching user answers:', error);
      }
    };

    fetchUserAnswers();
 
  }, [form, tests.length, chapterId]); 

  const [percentageCorrect, setPercentageCorrect] = useState<number>(0)

  const handleSubmitAll = async () => {
    const totalTests = tests.length;
    console.log(form.getValues('items'));

    const response = await axios.post(`/api/checkAnswer/${chapterId}`, {
      selectedAnswers: form.getValues('items'),
    });

    const results = response.data;

    const correctAnswersCount = results.reduce((count: number, result: { areAnswersCorrect: any }) => {
      if (result.areAnswersCorrect) {
        return count + 1;
      }
      return count;
    }, 0);
  
 
    const percentageCorrect = (correctAnswersCount / totalTests) * 100;
    setPercentageCorrect(percentageCorrect);

    if (percentageCorrect >= 60) {
      toast.success('You passed the test!');
    } else {
      toast.error('You need to review the test. Less than 60% correct.');
    }
  };


  return (
    <>
    <h1 className="text-2xl font-semibold mb-10">Test yourself</h1>
   { tests.map((test, index) => (

    <Form key={test.id} {...form}>
      <form  className="space-y-8 mb-20">
        <FormField
          control={form.control}
          name="items"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">{test.question}</FormLabel>
                <FormDescription >
                  (Select the correct answers.)
                </FormDescription>
              </div>
              {test.answerOptions.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="items"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.id}
                        className=" flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, item.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item.id
                                    )
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {item.option}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
   ))}
    <Button onClick={form.handleSubmit(handleSubmitAll)} type="submit">Submit</Button>
     
    <Wrapper percentageCorrect={percentageCorrect} courseId={courseId} nextChapterId={nextChapterId} completeOnEnd={completeOnEnd} chapterId={chapterId} tests={tests} isCompleted={isCompleted} />
      
    </>
  )
}